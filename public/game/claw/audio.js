/*
 * RecursiveIntell sound stage.
 * Every sample, instrument, and impulse is synthesized locally. The score is
 * scheduled on the audio clock; no timers accumulate when the game is paused.
 */
const TAU = Math.PI * 2;
const MIDI = note => 440 * 2 ** ((note - 69) / 12);
const bounded = (value, low, high) => Math.max(low, Math.min(high, value));
const ABILITY_NAMES = {
  'Arc Cleave': 'q', 'Aegis Pulse': 'e', 'Recursive Quake': 'r',
  'Forked Lightning': 'q', 'Restore Point': 'e', 'Context Collapse': 'r',
  'Threadshot': 'q', 'Ghost Process': 'e', 'Swarm Protocol': 'r',
};

export class Soundscape {
  constructor({context = null, seed = 77129, ambience = true} = {}) {
    this.ctx = context;
    this.offline = Boolean(context?.startRendering);
    this.seed = seed >>> 0;
    this.ambienceEnabled = ambience;
    this.enabled = true;
    this.music = true;
    this.started = false;
    this.disposed = false;
    this.voices = new Map();
    this.continuous = [];
    this.lastEvents = new Map();
    this.plucks = new Map();
    this.state = {classId: 'warden', chapter: 0, phase: 'title', paused: false};
    this.intensity = 0;
    this.step = 0;
    this.nextStep = 0;
    this.footstepTimer = 0;
    this.mixTimer = 0;
    this.footSide = 1;
    this.createdVoices = 0;
    this.finishedVoices = 0;
    this.maxVoices = 0;
  }

  random() {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  start() {
    if (this.disposed) return;
    try {
      if (!this.ctx) {
        const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Audio) return;
        this.ctx = new Audio({latencyHint: 'interactive'});
      }
      if (!this.started) {
        this.buildGraph();
        this.started = true;
        this.configure({sound: this.enabled, music: this.music});
        this.nextStep = this.ctx.currentTime + .08;
        if (this.ambienceEnabled) this.buildAmbience();
        if (!this.offline && globalThis.document) {
          this.visibilityHandler = () => {
            if (document.hidden) this.ctx.suspend?.().catch?.(() => {});
            else this.ctx.resume?.().catch?.(() => {});
          };
          document.addEventListener('visibilitychange', this.visibilityHandler);
        }
        this.scheduleScore(this.ctx.currentTime + .3);
      }
      if (!this.offline && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    } catch (error) {
      // Audio is optional; a denied browser audio context must never stop play.
      this.lastError = error.message;
    }
  }

  buildGraph() {
    const c = this.ctx;
    this.mix = c.createGain();
    this.mix.gain.value = 1;
    const compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -15;
    compressor.knee.value = 15;
    compressor.ratio.value = 3.5;
    compressor.attack.value = .006;
    compressor.release.value = .23;
    const limiter = c.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.knee.value = 2;
    limiter.ratio.value = 20;
    limiter.attack.value = .001;
    limiter.release.value = .12;
    const softLimit = c.createWaveShaper();
    const curve = new Float32Array(2049);
    for (let i = 0; i < curve.length; i++) {
      const x = i * 2 / (curve.length - 1) - 1;
      curve[i] = .96 * x / (1 + .2 * Math.abs(x));
    }
    softLimit.curve = curve;
    softLimit.oversample = '2x';
    this.master = c.createGain();
    this.master.gain.value = .82;
    this.analyser = c.createAnalyser();
    this.analyser.fftSize = 2048;
    this.mix.connect(compressor).connect(limiter).connect(softLimit).connect(this.master).connect(this.analyser).connect(c.destination);
    this.sfxGain = c.createGain();
    this.sfxGain.gain.value = this.enabled ? .92 : 0;
    this.sfxGain.connect(this.mix);
    this.musicGain = c.createGain();
    this.musicGain.gain.value = this.music ? .59 : 0;
    this.musicFilter = c.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = 3500;
    this.musicFilter.Q.value = .35;
    this.musicGain.connect(this.musicFilter).connect(this.mix);
    this.ambientGain = c.createGain();
    this.ambientGain.gain.value = .5;
    this.ambientGain.connect(this.sfxGain);
    this.noise = this.makeNoise(4);
    const impulse = this.makeImpulse(2.65);
    this.reverb = {};
    this.reverbNodes = [];
    for (const route of ['sfx', 'music']) {
      const input = c.createBiquadFilter();
      input.type = 'lowpass';
      input.frequency.value = route === 'music' ? 3900 : 5400;
      input.Q.value = .4;
      const convolver = c.createConvolver();
      convolver.buffer = impulse;
      convolver.normalize = true;
      input.connect(convolver).connect(route === 'music' ? this.musicGain : this.sfxGain);
      this.reverb[route] = input;
      this.reverbNodes.push(input, convolver);
    }
    this.graphNodes = [this.mix, compressor, limiter, softLimit, this.master,
      this.analyser, this.sfxGain, this.musicGain, this.musicFilter, this.ambientGain, ...this.reverbNodes];
  }

  makeNoise(seconds) {
    const buffer = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * seconds), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < data.length; i++) {
      const value = this.random() * 2 - 1;
      data[i] = value - previous * .16;
      previous = value;
    }
    return buffer;
  }

  makeImpulse(seconds) {
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(2, Math.ceil(sr * seconds), sr);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let low = 0;
      for (let i = 0; i < data.length; i++) {
        const time = i / sr;
        low = low * .48 + (this.random() * 2 - 1) * .52;
        const bloom = Math.min(1, Math.max(0, time - .013) * 24);
        data[i] = low * Math.exp(-time * 3.5 / seconds) * (1 - time / seconds) ** 1.7 * bloom;
      }
      for (const [delay, amp] of [[.019,.7],[.037,.48],[.061,.33],[.097,.21],[.151,.12]]) {
        data[Math.floor(sr * (delay + channel * .0023))] += amp;
      }
    }
    return buffer;
  }

  configure(settings = {}) {
    if (typeof settings.sound === 'boolean') this.enabled = settings.sound;
    if (typeof settings.music === 'boolean') this.music = settings.music;
    if (!this.started) return;
    const t = this.ctx.currentTime;
    this.sfxGain.gain.setTargetAtTime(this.enabled ? .92 : 0, t, .07);
    this.musicGain.gain.setTargetAtTime(this.music ? .59 : 0, t, .3);
    if (this.music && this.nextStep < t) this.nextStep = t + .03;
  }

  // All finite voices are stopped by the audio clock and disconnect on completion.
  voice(source, {duration, volume, attack = .004, hold = 0, when,
    pan = 0, route = 'sfx', wet = .16, cutoff = 16000, filterType = 'lowpass',
    filterEnd, q = .55, decay = true} = {}) {
    if (this.voices.size >= 160) { try { source.disconnect(); } catch {} return; }
    const c = this.ctx, t = Math.max(c.currentTime, when ?? c.currentTime + .004);
    const length = Math.max(.015, duration || .2), peak = Math.max(.0001, volume || .04);
    const filter = c.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(bounded(cutoff, 25, c.sampleRate * .45), t);
    if (filterEnd) filter.frequency.exponentialRampToValueAtTime(bounded(filterEnd, 25, c.sampleRate * .45), t + length);
    const gain = c.createGain();
    const a = Math.min(attack, length * .45), h = Math.min(hold, length * .3);
    gain.gain.setValueAtTime(.00001, t);
    gain.gain.linearRampToValueAtTime(peak, t + Math.max(.001, a));
    if (h) gain.gain.setValueAtTime(peak, t + a + h);
    if (decay) gain.gain.exponentialRampToValueAtTime(.00001, t + length);
    else {gain.gain.setValueAtTime(peak, t + length * .65);gain.gain.exponentialRampToValueAtTime(.00001, t + length);}
    const panner = c.createStereoPanner();
    panner.pan.value = bounded(pan, -.95, .95);
    source.connect(filter).connect(gain).connect(panner);
    panner.connect(route === 'music' ? this.musicGain : this.sfxGain);
    const send = c.createGain();
    send.gain.value = wet;
    panner.connect(send).connect(this.reverb[route]);
    const nodes = [source, filter, gain, panner, send];
    this.voices.set(source, {nodes, route, end: t + length + .025});
    this.createdVoices++;
    this.maxVoices = Math.max(this.maxVoices, this.voices.size);
    source.onended = () => {
      for (const node of nodes) { try { node.disconnect(); } catch {} }
      source.onended = null;
      this.voices.delete(source);
      this.finishedVoices++;
    };
    if (source.buffer) source.start(t, source.buffer === this.noise ? this.random() * 2 : 0);
    else source.start(t);
    source.stop(t + length + .025);
    return source;
  }

  tone(freq, duration, volume, options = {}) {
    if (!this.started) return;
    const source = this.ctx.createOscillator();
    source.type = options.type || 'sine';
    const t = Math.max(this.ctx.currentTime, options.when ?? this.ctx.currentTime + .004);
    source.frequency.setValueAtTime(Math.max(15, freq), t);
    if (options.to) source.frequency.exponentialRampToValueAtTime(Math.max(15, options.to), t + duration);
    if (options.detune) source.detune.value = options.detune;
    return this.voice(source, {duration, volume, ...options});
  }

  hiss(duration, volume, options = {}) {
    if (!this.started) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    return this.voice(source, {duration, volume, cutoff: 1800, ...options});
  }

  pluck(freq, duration, volume, options = {}) {
    const brightness = options.brightness ?? .5;
    const key = `${freq.toFixed(2)}:${duration.toFixed(2)}:${brightness.toFixed(2)}`;
    let buffer = this.plucks.get(key);
    if (!buffer) {
      const sr = this.ctx.sampleRate, length = Math.ceil(sr * duration);
      const period = Math.max(3, Math.floor(sr / freq));
      const line = new Float32Array(period);
      for (let i = 0; i < period; i++) line[i] = this.random() * 2 - 1;
      buffer = this.ctx.createBuffer(1, length, sr);
      const data = buffer.getChannelData(0);
      const damping = .987 + brightness * .010;
      let filtered = 0;
      for (let i = 0; i < length; i++) {
        const index = i % period, value = line[index];
        line[index] = (value + line[(index + 1) % period]) * .5 * damping;
        filtered = filtered * .3 + value * .7;
        data[i] = filtered * Math.min(1, i / 35) * Math.min(1, (length - i) / 250);
      }
      if (this.plucks.size >= 96) this.plucks.delete(this.plucks.keys().next().value);
      this.plucks.set(key, buffer);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    return this.voice(source, {duration, volume, attack: .002, cutoff: 6500, wet: .3, ...options});
  }

  metal(freq, volume, when, {duration = .44, pan = 0, wet = .18, soft = false} = {}) {
    const ratios = soft ? [1,2.003,3.01] : [1,2.76,4.07,5.83];
    ratios.forEach((ratio, i) => this.tone(freq * ratio, duration / (1 + i * .37), volume / (1 + i * 1.8),
      {when, pan, wet, cutoff: soft ? 3300 : 6200, attack: .002}));
  }

  thump(when, volume = .12, frequency = 95, duration = .22) {
    this.tone(frequency, duration, volume, {when, to: frequency * .37, cutoff: 460, wet: .08});
    this.hiss(.045, volume * .42, {when, cutoff: 550, filterEnd: 130, wet: .08});
  }

  swish(when, volume = .16, duration = .2, pan = 0, reverse = false) {
    this.hiss(duration, volume, {when, attack: duration * .23, cutoff: reverse ? 350 : 2400,
      filterEnd: reverse ? 4200 : 280, filterType: 'bandpass', q: .7, pan, wet: .2});
    this.hiss(duration * .7, volume * .15, {when: when + .025, cutoff: 6400, filterEnd: 1400, pan: -pan, wet: .1});
  }

  attack(classId, when, scale = 1) {
    const side = (this.random() - .5) * .36;
    if (classId === 'weaver') {
      this.hiss(.14, .12 * scale, {when, cutoff: 760, filterEnd: 3900, filterType: 'bandpass', q: 2.3, pan: side, wet: .28});
      this.tone(173 + this.random()*19, .19, .035*scale, {when, type: 'triangle', to: 590, cutoff: 1500, wet: .35});
      this.metal(632, .023*scale, when + .045, {duration: .23, wet: .28, soft: true});
    } else if (classId === 'ranger') {
      this.pluck(91 + this.random()*8, .25, .21*scale, {when, cutoff: 2300, brightness: .25, wet: .11, pan: side});
      this.swish(when + .032, .095*scale, .16, side);
      this.hiss(.018, .045*scale, {when, cutoff: 2800, wet: .06});
    } else {
      this.swish(when, .23*scale, .23, side);
      this.hiss(.03, .09*scale, {when: when + .04, cutoff: 620, wet: .08});
      this.metal(183 + this.random()*20, .024*scale, when + .09, {duration: .22, pan: side, wet: .13});
    }
  }

  ability(classId, key, when) {
    if (key === 'e') {
      if (classId === 'warden') {
        this.thump(when, .16, 108, .28);
        this.metal(164.81, .10, when + .04, {duration: 1.15, soft: true, wet: .45});
        this.hiss(.75, .06, {when, attack: .1, cutoff: 620, filterEnd: 2100, wet: .4});
      } else if (classId === 'ranger') {
        this.swish(when, .17, .45, -.4, true);
        this.swish(when + .1, .13, .4, .4);
      } else {
        this.hiss(.7, .1, {when, attack: .28, cutoff: 500, filterEnd: 2700, wet: .55});
        [0,7,14].forEach((n,i)=>this.tone(MIDI(57+n), .9, .032, {when: when+i*.07, attack: .2, type: 'triangle', cutoff: 1800, wet: .5, pan: (i-1)*.25}));
      }
      this.shimmer(when + .11, 'uncommon', .6);
      return;
    }
    if (classId === 'warden') {
      if (key === 'q') {
        this.swish(when, .33, .37, -.22);
        this.thump(when + .12, .18, 130, .25);
        this.metal(142, .10, when + .12, {duration: .75, wet: .29});
        this.swish(when + .17, .13, .3, .32);
      } else {
        this.hiss(.36, .13, {when, attack: .13, cutoff: 180, filterEnd: 1500, wet: .2});
        this.thump(when + .17, .28, 78, .7);
        this.hiss(1.15, .24, {when: when+.19, cutoff: 650, filterEnd: 80, attack: .014, wet: .42});
        this.metal(98, .12, when + .19, {duration: 1.4, wet: .5});
        for(let i=0;i<4;i++)this.hiss(.14,.05,{when:when+.3+i*.09,cutoff:2100-i*300,pan:(i-1.5)*.3,wet:.25});
      }
    } else if (classId === 'weaver') {
      if (key === 'q') {
        for (let i=0;i<3;i++) {
          const t=when+i*.045;
          this.hiss(.16,.11,{when:t,cutoff:850+i*450,filterEnd:4300,filterType:'bandpass',q:3,wet:.28,pan:(i-1)*.3});
          this.tone(210+i*43,.2,.04,{when:t,to:130+i*17,type:'sawtooth',cutoff:1100,filterEnd:450,wet:.35});
        }
        this.thump(when+.08,.11,100,.21);
      } else {
        this.swish(when,.19,.5,-.15,true);
        this.tone(210,.5,.065,{when,to:48,type:'triangle',cutoff:900,wet:.45});
        this.hiss(1.15,.2,{when:when+.3,attack:.035,cutoff:4200,filterEnd:250,wet:.55});
        this.thump(when+.31,.23,76,.6);
        [110,164.81,246.94,329.63].forEach((f,i)=>this.tone(f,1.8,.035,{when:when+.32+i*.035,attack:.035,wet:.7,pan:(i-1.5)*.2}));
      }
    } else if (key === 'q') {
      [0,.065,.13].forEach((offset,i)=>{this.attack('ranger',when+offset,.85);this.metal(410+i*80,.018,when+offset+.1,{duration:.3,wet:.2});});
    } else {
      this.pluck(73.42,.6,.3,{when,cutoff:2000,wet:.3});
      for(let i=0;i<9;i++) {
        this.swish(when+.1+i*.075,.085,.19,(i%3-1)*.5);
        this.hiss(.028,.055,{when:when+.2+i*.075,cutoff:1600+i*80,pan:(i%3-1)*.5,wet:.3});
      }
      this.tone(146.83,1.1,.045,{when:when+.15,type:'triangle',cutoff:550,wet:.45});
    }
  }

  shimmer(when, rarity = 'common', scale = 1) {
    const rank = Math.max(0, ['common','uncommon','rare','epic','legendary'].indexOf(rarity));
    const notes = [62,69,74,77,81,86].slice(0,2+rank);
    notes.forEach((note,i)=>this.pluck(MIDI(note), .65+rank*.1, (.105-i*.008)*scale,
      {when:when+i*.07, brightness:.44, cutoff:3800, wet:.35+rank*.07, pan:(i-(notes.length-1)/2)*.1}));
    this.hiss(.12+rank*.04,.025*scale,{when,cutoff:6200,filterType:'highpass',wet:.4});
    if(rank>=3)this.tone(MIDI(50),1.5,.035*scale,{when,attack:.09,wet:.6,cutoff:1300,type:'triangle'});
  }

  potion(when) {
    this.metal(740,.024,when,{duration:.24,soft:true,wet:.2});
    for(let i=0;i<5;i++) {
      const t=when+.035+i*.046;
      this.hiss(.045,.055,{when:t,cutoff:250+i*100,filterType:'bandpass',q:1.3,wet:.06});
      this.tone(190+i*53,.055,.024,{when:t,to:125+i*21,wet:.04,cutoff:900});
    }
    this.hiss(.38,.045,{when:when+.12,attack:.07,cutoff:1900,filterEnd:3400,filterType:'bandpass',wet:.4});
    [0,7,12].forEach((n,i)=>this.pluck(MIDI(62+n),.7,.045,{when:when+.22+i*.08,cutoff:3200,wet:.45}));
  }

  event(type, detail = {}) {
    if (!this.started || !this.enabled || this.disposed) return;
    if (typeof detail === 'string') detail = {name: detail};
    const when = Number.isFinite(detail.when) ? detail.when : this.ctx.currentTime + .006;
    const throttle = {attack:.07,hit:.045,kill:.075,loot:.12,ui:.045,footstep:.15}[type] || 0;
    if (when - (this.lastEvents.get(type) ?? -100) < throttle) return;
    this.lastEvents.set(type, when);
    const classId = detail.classId || this.state.classId || 'warden';
    const pan = bounded(Number(detail.pan)||0,-.8,.8);
    if (type === 'attack') this.attack(classId,when);
    else if (type === 'ability') this.ability(classId,detail.key || ABILITY_NAMES[detail.name] || 'q',when);
    else if (type === 'hit') {
      this.thump(when, detail.critical ? .14 : .095, 110+this.random()*25,.18);
      this.hiss(.065,.1,{when,cutoff:2100,filterEnd:600,wet:.13,pan});
      this.metal(250+this.random()*70,detail.critical?.055:.027,when,{duration:.26,wet:.16,pan});
    } else if (type === 'hurt') {
      this.thump(when,.20,73,.3);
      this.hiss(.14,.12,{when,cutoff:740,filterEnd:190,wet:.08});
      this.tone(48,.3,.035,{when:when+.07,to:39,cutoff:150,wet:.1});
    } else if (type === 'kill') {
      this.hiss(.4,.13,{when,cutoff:2700,filterEnd:420,wet:.32,pan});
      this.metal(145+this.random()*70,.044,when,{duration:.42,wet:.25,pan});
      for(let i=0;i<3;i++)this.hiss(.03,.045,{when:when+.06+i*.055,cutoff:1000+i*500,pan:pan+(i-1)*.2,wet:.15});
    } else if (type === 'loot' || type === 'chest') {
      if(type==='chest'){this.hiss(.16,.11,{when,cutoff:750,filterEnd:1600,wet:.18});this.metal(196,.045,when+.08,{duration:.37,wet:.2});}
      this.shimmer(when+(type==='chest'?.12:0),detail.rarity||'common');
    } else if (type === 'equip') {
      this.hiss(.12,.10,{when,cutoff:620,filterEnd:1500,wet:.08});
      this.metal(330,.045,when+.035,{duration:.3,soft:true,wet:.16});
    } else if (type === 'forge' || type === 'upgrade') {
      for(const [offset,scale] of [[0,.7],[.21,1],[.47,.85]]) {
        this.thump(when+offset,.16*scale,115,.23);
        this.metal(207,.10*scale,when+offset,{duration:.66,wet:.27});
        this.hiss(.08,.13*scale,{when:when+offset,cutoff:3500,filterEnd:800,wet:.2});
      }
      this.shimmer(when+.63,'rare',.5);
    } else if (type === 'salvage') {
      this.hiss(.3,.09,{when,cutoff:1700,filterEnd:350,wet:.15});
      this.metal(440,.035,when+.08,{duration:.2,wet:.2});
      this.pluck(MIDI(74),.45,.065,{when:when+.2,wet:.25});
    } else if (type === 'heal' || type === 'potion') this.potion(when);
    else if (type === 'dash') {
      this.swish(when,.17,.28,-.25,true);
      this.swish(when+.07,.13,.24,.35);
      this.hiss(.2,.08,{when,cutoff:250,filterEnd:600,wet:.15});
    } else if (type === 'level' || type === 'complete' || type === 'victory') this.cadence(type,when);
    else if (type === 'death') {
      this.tone(110,2.5,.08,{when,to:41.2,type:'triangle',cutoff:900,filterEnd:120,wet:.55,attack:.02});
      this.hiss(2.2,.12,{when,attack:.06,cutoff:1800,filterEnd:140,wet:.6});
      [50,53,57].forEach((n,i)=>this.tone(MIDI(n),2.3,.03,{when:when+.16+i*.09,attack:.22,wet:.65,cutoff:800}));
    } else if (type === 'boss') {
      this.thump(when,.17,65,.6);
      this.metal(82.41,.06,when+.08,{duration:1.3,wet:.5,soft:true});
    } else if (type === 'ui' || type === 'click' || type === 'talent') {
      this.hiss(.018,.055,{when,cutoff:1700,filterEnd:600,wet:.05});
      this.tone(245,.045,.026,{when,to:190,cutoff:900,wet:.05});
      if(type==='talent')this.pluck(MIDI(69),.45,.065,{when:when+.035,wet:.3});
    } else if (type === 'footstep') {
      this.hiss(.085,.07,{when,cutoff:600,filterEnd:220,wet:.11,pan});
      this.hiss(.025,.03,{when:when+.008,cutoff:1800,wet:.06,pan});
      this.tone(80+this.random()*22,.055,.027,{when,to:48,cutoff:200,wet:.08,pan});
    }
  }

  cadence(kind,when) {
    const victory=kind==='victory',notes=victory?[50,57,62,65,69,74]:kind==='level'?[62,65,69,74]:[57,62,65,69];
    notes.forEach((n,i)=>this.pluck(MIDI(n),victory?1.7:1.0,.14,{when:when+i*.13,brightness:.6,wet:.5,pan:(i-notes.length/2)*.12}));
    [50,57,65].forEach((n,i)=>this.tone(MIDI(n),victory?3.7:1.8,.035,{when:when+.12,attack:.2+i*.05,type:'triangle',cutoff:1700,wet:.55,pan:(i-1)*.3}));
    this.hiss(.65,.025,{when:when+.12,attack:.14,cutoff:5200,filterType:'bandpass',wet:.5});
  }

  buildAmbience() {
    const c=this.ctx,sr=c.sampleRate,length=Math.ceil(sr*8);
    const wind=c.createBuffer(2,length,sr),rain=c.createBuffer(2,length,sr),machine=c.createBuffer(2,length,sr);
    for(let channel=0;channel<2;channel++) {
      const a=wind.getChannelData(channel),b=rain.getChannelData(channel),d=machine.getChannelData(channel);
      let brown=0,soft=0;
      for(let i=0;i<length;i++) {
        const t=i/sr,n=this.random()*2-1;
        brown=(brown+n*.025)/1.025;soft=soft*.7+n*.3;
        const swell=.7+.18*Math.sin(TAU*t/8+channel)+.1*Math.sin(TAU*t*.5+channel*.7);
        a[i]=brown*2.5*swell;b[i]=(n-soft)*.32;
        d[i]=(.26*Math.sin(TAU*40*t)+.1*Math.sin(TAU*80*t)+brown*.4)*(.8+.2*Math.sin(TAU*t*.25));
      }
      // Crossfade the seam so looping environments never click.
      const fade=Math.floor(sr*.1);
      for(let i=0;i<fade;i++){const f=i/fade;a[length-fade+i]=a[length-fade+i]*(1-f)+a[i]*f;b[length-fade+i]=b[length-fade+i]*(1-f)+b[i]*f;d[length-fade+i]=d[length-fade+i]*(1-f)+d[i]*f;}
    }
    this.ambientControls={};
    for(const [name,buffer,cutoff,volume] of [['wind',wind,880,.17],['rain',rain,4300,.022],['machine',machine,280,.035]]) {
      const source=c.createBufferSource();source.buffer=buffer;source.loop=true;source.loopStart=.1;source.loopEnd=8;
      const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=cutoff;filter.Q.value=.4;
      const gain=c.createGain();gain.gain.setValueAtTime(0,c.currentTime);gain.gain.setTargetAtTime(volume,c.currentTime,.8);
      source.connect(filter).connect(gain).connect(this.ambientGain);source.start();
      this.continuous.push({source,nodes:[source,filter,gain]});this.ambientControls[name]=gain;
    }
  }

  scheduleScore(until) {
    if(!this.started||this.disposed)return;
    const now=this.ctx.currentTime;
    if(!this.music){this.nextStep=now+.05;return;}
    if(this.nextStep<now-.1)this.nextStep=now+.025;
    // A bounded horizon prevents accidental multi-hour queues in tooling.
    const horizon=Math.min(until,now+30);
    while(this.nextStep<horizon) {
      this.scoreStep(this.step,this.nextStep);
      this.step++;
      const bpm=(this.state.chapter>=6?81:75)+this.intensity*7;
      this.nextStep+=60/bpm/4;
    }
  }

  scoreStep(step,when) {
    const position=step%16,bar=Math.floor(step/16),act=this.state.chapter>=6?1:0;
    const rotation=Math.floor((this.state.chapter%6)/2),progression=[0,-4,3,-2],chordIndex=(bar+rotation)%4;
    const root=(act?40:38)+progression[chordIndex],minor=chordIndex===0;
    const chord=minor?[0,3,7,10,14]:chordIndex===3?[0,4,7,10,14]:[0,4,7,11,14],calm=this.state.paused||this.state.phase!=='playing';
    const energy=calm?.1:this.intensity;
    if(position===0) {
      const duration=60/(act?81:75)*4+1.0;
      for(const [i,interval] of [0,2,3,4].entries()) {
        const freq=MIDI(root+12+chord[interval]),pan=(i-1.5)*.33;
        this.tone(freq,duration,.027/(1+i*.12),{when,attack:.6,hold:.35,decay:false,type:'triangle',cutoff:1250+energy*900,wet:.6,route:'music',pan});
        this.tone(freq,duration,.013,{when,attack:.85,hold:.25,decay:false,type:'sine',detune:i%2?4:-4,cutoff:1800,wet:.65,route:'music',pan:-pan});
      }
    }
    if(position===0||position===8) {
      this.tone(MIDI(root),.95,.10,{when,attack:.025,type:'triangle',cutoff:250,wet:.13,route:'music'});
      this.tone(MIDI(root-12),.7,.025,{when,attack:.035,cutoff:160,wet:.08,route:'music'});
    }
    const melody=[0,null,2,null,3,2,null,4,null,2,1,null,0,null,2,null];
    const noteIndex=melody[(position+(bar%4===3?4:0))%16];
    if(noteIndex!==null && (position%4===0 || !calm) && (bar%4!==2 || position%4===0)) {
      const octave=bar%8>=4?24:12;
      this.pluck(MIDI(root+octave+chord[noteIndex]),1.5,.085,{when:when+.012,brightness:.38,cutoff:2600+energy*1100,wet:.6,route:'music',pan:Math.sin(step*.71)*.35});
    }
    if(energy>.13 && (position===0||position===8||(energy>.65&&position===11))) {
      this.tone(78,.24,.095*energy,{when,to:35,cutoff:200,wet:.09,route:'music'});
      this.hiss(.04,.025*energy,{when,cutoff:500,wet:.13,route:'music'});
    }
    if(energy>.3 && (position===4||position===12)) {
      this.hiss(.14,.055*energy,{when,cutoff:1300,filterEnd:400,wet:.25,route:'music',pan:-.15});
      this.tone(146,.12,.035*energy,{when,to:85,cutoff:400,wet:.18,route:'music'});
    }
    if(energy>.4 && position%4===2) this.hiss(.06,.018*energy,{when,cutoff:5800,filterType:'highpass',wet:.2,route:'music',pan:.32});
  }

  update(state,dt=.016) {
    if(state)this.state=state;
    if(!this.started||this.disposed||this.ctx.state==='closed')return;
    const s=this.state,t=this.ctx.currentTime;
    const moving=s.phase==='playing'&&!s.paused&&s.player?.moving;
    const enemies=s.enemies||[],p=s.player;
    const near=p?enemies.filter(e=>e.hp>0&&(e.aggro||Math.hypot(e.x-p.x,e.z-p.z)<8)).length:0;
    const boss=enemies.some(e=>e.type==='boss'&&e.hp>0&&e.aggro);
    const target=s.phase==='playing'&&!s.paused?bounded(near*.13+(boss?.4:0),0,1):0;
    this.intensity+=(target-this.intensity)*Math.min(1,dt*(target>this.intensity?1.4:.32));
    this.mixTimer-=dt;
    if(this.mixTimer<=0) {
      this.mixTimer=.15;
      this.musicFilter.frequency.setTargetAtTime(s.paused?1450:3100+this.intensity*1800,t,.5);
      this.ambientGain.gain.setTargetAtTime(s.paused?.28:.5,t,.5);
      if(this.ambientControls) {
        const outdoor=[0,2,4,6,9].includes(s.chapter);
        this.ambientControls.wind.gain.setTargetAtTime(outdoor?.17:.065,t,1.5);
        this.ambientControls.rain.gain.setTargetAtTime(outdoor?.024:.006,t,1.5);
        this.ambientControls.machine.gain.setTargetAtTime(outdoor?.025:.075,t,1.5);
      }
    }
    if(moving&&this.enabled) {
      this.footstepTimer-=Math.min(.1,dt);
      if(this.footstepTimer<=0){this.footSide*=-1;this.event('footstep',{pan:this.footSide*.12});this.footstepTimer=bounded(1.9/(p.speed||5.5),.23,.42);}
    } else this.footstepTimer=.08;
    this.scheduleScore(t+.28);
  }

  getDiagnostics() {
    let peak=0,rms=0;
    if(this.analyser){const data=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(data);for(const sample of data){peak=Math.max(peak,Math.abs(sample));rms+=sample*sample;}rms=Math.sqrt(rms/data.length);}
    return {started:this.started,contextState:this.ctx?.state||'unavailable',sound:this.enabled,music:this.music,
      liveVoices:this.voices.size,createdVoices:this.createdVoices,finishedVoices:this.finishedVoices,maxVoices:this.maxVoices,
      ambientLoops:this.continuous.length,cachedInstruments:this.plucks.size,peak,rms,intensity:this.intensity,lastError:this.lastError||null};
  }

  dispose() {
    if(this.disposed)return;this.disposed=true;
    for(const [source,{nodes}] of this.voices){source.onended=null;try{source.stop();}catch{}for(const node of nodes){try{node.disconnect();}catch{}}}
    this.voices.clear();
    for(const {source,nodes} of this.continuous){try{source.stop();}catch{}for(const node of nodes){try{node.disconnect();}catch{}}}
    this.continuous=[];
    for(const node of this.graphNodes||[]){try{node.disconnect();}catch{}}
    if(this.visibilityHandler)document.removeEventListener('visibilitychange',this.visibilityHandler);
    if(this.ctx&&!this.offline&&this.ctx.state!=='closed')this.ctx.close().catch(()=>{});
    this.plucks.clear();
  }
}

export function analyzeAudioBuffer(buffer) {
  let peak=0,power=0,nonFinite=0,clippedSamples=0;
  const samples=buffer.length*buffer.numberOfChannels;
  for(let c=0;c<buffer.numberOfChannels;c++)for(const value of buffer.getChannelData(c)) {
    if(!Number.isFinite(value)){nonFinite++;continue;}
    peak=Math.max(peak,Math.abs(value));power+=value*value;if(Math.abs(value)>=.999)clippedSamples++;
  }
  const rms=Math.sqrt(power/Math.max(1,samples));
  return {duration:buffer.duration,channels:buffer.numberOfChannels,sampleRate:buffer.sampleRate,peak,rms,
    rmsDb:20*Math.log10(Math.max(rms,1e-12)),nonFinite,clippedSamples};
}
