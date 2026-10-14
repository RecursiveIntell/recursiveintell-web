import * as THREE from './vendor/three.module.min.js';

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const scratch = new THREE.Object3D();
const v3 = new THREE.Vector3();
const color = new THREE.Color();
const palettes = [
  { stone: '#344650', floor: '#3a4850', metal: '#354452', copper: '#b08b54', glow: '#61e9d3', accent: '#cf5638', sky: '#08151d' },
  { stone: '#35404a', floor: '#41494d', metal: '#45424d', copper: '#ba8c58', glow: '#5de1cd', accent: '#ba493e', sky: '#10151f' },
  { stone: '#333f45', floor: '#3d4645', metal: '#2b4641', copper: '#a99a68', glow: '#92efd1', accent: '#d57b43', sky: '#0d1c1d' },
  { stone: '#393845', floor: '#3e404d', metal: '#383649', copper: '#b49e69', glow: '#bf91ff', accent: '#d85563', sky: '#151120' },
  { stone: '#40454d', floor: '#474d51', metal: '#3e4f59', copper: '#bc9865', glow: '#64cfe8', accent: '#db7552', sky: '#0c1921' },
  { stone: '#353b47', floor: '#41434b', metal: '#3c3b49', copper: '#c29a5d', glow: '#65e6db', accent: '#ec5c42', sky: '#10121d' },
  { stone: '#657078', floor: '#66757a', metal: '#4a5968', copper: '#d3bb87', glow: '#9bb6ff', accent: '#a89afa', sky: '#0e1729' },
  { stone: '#56687a', floor: '#65737c', metal: '#465772', copper: '#c3b891', glow: '#a4ddff', accent: '#b48ae3', sky: '#101d2b' },
  { stone: '#626776', floor: '#727080', metal: '#4b4c6a', copper: '#c5b38f', glow: '#d9b8ff', accent: '#db83b0', sky: '#1c162c' },
  { stone: '#496573', floor: '#526c75', metal: '#3d5866', copper: '#b6bd96', glow: '#92efec', accent: '#8ba9f3', sky: '#0e202a' },
  { stone: '#625e72', floor: '#6b657b', metal: '#4e4866', copper: '#d5b88f', glow: '#d6baff', accent: '#bb80e4', sky: '#1b142b' },
  { stone: '#696979', floor: '#747485', metal: '#4b4a63', copper: '#e4c48a', glow: '#c5bcff', accent: '#b594ff', sky: '#151628' },
];

function rng(seed = 1) {
  let s = (Number(seed) || 1) >>> 0;
  return () => { s += 0x6D2B79F5; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function canvasTexture(size, paint) {
  const c = document.createElement('canvas'); c.width = size; c.height = size;
  paint(c.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function bevelGeometry() {
  const s = new THREE.Shape(); s.moveTo(-.46, -.5); s.lineTo(.46, -.5); s.lineTo(.5, -.46); s.lineTo(.5, .46); s.lineTo(.46, .5); s.lineTo(-.46, .5); s.lineTo(-.5, .46); s.lineTo(-.5, -.46); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: .9, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .045, bevelThickness: .05 });
  g.translate(0, 0, -.46); return g;
}

function flatRing(inner, outer, segments = 64) {
  const g = new THREE.RingGeometry(inner, outer, segments); g.rotateX(-Math.PI / 2); return g;
}

export class WorldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-16, 16, 9, -9, .1, 180);
    this.camera.position.set(24, 40, 40);
    this.camera.lookAt(0, 0, 12);
    this.cameraTarget = new THREE.Vector3(0, 0, 12);
    this.cameraOffset = new THREE.Vector3(24, 29, 24);
    this.zoom = 1.12;
    this.targetZoom = 1.12;
    this.clock = 0;
    this.entities = new Map(); this.objectModels = new Map(); this.dropModels = new Map(); this.effectModels = new Map();
    this.staticRoot = new THREE.Group(); this.actorRoot = new THREE.Group(); this.fxRoot = new THREE.Group();
    this.scene.add(this.staticRoot, this.actorRoot, this.fxRoot);
    this.materials = new Map(); this.textures = []; this.ownedGeometries = new Set(); this.levelMaterials = new Set(); this.levelGeometries = new Set(); this.lanternPositions = [];
    this.geom = {
      box: new THREE.BoxGeometry(1, 1, 1), bevel: bevelGeometry(), sphere: new THREE.SphereGeometry(1, 24, 16),
      ico: new THREE.IcosahedronGeometry(1, 0), oct: new THREE.OctahedronGeometry(1, 0),
      cylinder: new THREE.CylinderGeometry(1, 1, 1, 20), cone: new THREE.ConeGeometry(1, 1, 20), tapered: new THREE.CylinderGeometry(.65, 1, 1, 12),
      torus: new THREE.TorusGeometry(1, .065, 8, 64), ring: flatRing(.94, 1), thinRing: flatRing(.989, 1), disc: new THREE.CircleGeometry(1, 64),
      plane: new THREE.PlaneGeometry(1, 1), helmet: new THREE.CylinderGeometry(.76,1,1,12), slash: new THREE.TorusGeometry(1, .045, 4, 24, Math.PI * 1.2),
    };
    Object.values(this.geom).forEach(g => this.ownedGeometries.add(g));
    this.stoneTexture = canvasTexture(256, (ctx, size) => {
      const random = rng(914); ctx.fillStyle = '#c1bcb3'; ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 3300; i++) { const n = 120 + random() * 100; ctx.fillStyle = `rgba(${n},${n},${n},${.08 + random() * .19})`; ctx.fillRect(random() * size, random() * size, 1 + random() * 4, 1 + random() * 3); }
      ctx.strokeStyle = 'rgba(37,46,49,.32)'; ctx.lineWidth = 1.5;
      for (let j = 0; j < 4; j++) { let x = random() * size, y = random() * size; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += random() * 27 - 12; y += random() * 24 - 4; ctx.lineTo(x, y); } ctx.stroke(); }
      ctx.strokeStyle = 'rgba(232,229,208,.24)'; ctx.strokeRect(4, 4, 248, 248);
    });
    this.moteTexture = canvasTexture(64, (ctx, n) => { const g = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.16, 'rgba(255,255,255,.8)'); g.addColorStop(.45, 'rgba(255,255,255,.15)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, n, n); });
    this.bannerTexture = canvasTexture(256, (ctx, n) => {
      ctx.clearRect(0, 0, n, n); ctx.fillStyle = '#e5c38e';
      ctx.beginPath(); ctx.ellipse(128, 136, 37, 49, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(64, 91, 27, 33, -.5, 0, TAU); ctx.ellipse(192, 91, 27, 33, .5, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#e5c38e'; ctx.lineWidth = 13; ctx.lineCap = 'round';
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(128 + side * 23, 130); ctx.lineTo(128 + side * 62, 112); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(128 + side * 28, 132 + i * 16); ctx.lineTo(128 + side * 61, 151 + i * 17); ctx.stroke(); } }
      ctx.fillStyle = '#172a31'; for (const x of [114, 142]) { ctx.beginPath(); ctx.arc(x, 116, 7, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = '#e5c38e'; ctx.lineWidth = 2; ctx.strokeRect(12, 12, n - 24, n - 24);
    });
    this.textures.push(this.stoneTexture, this.moteTexture, this.bannerTexture);
    this.initArtMaterials();
    this.bannerMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', map: this.bannerTexture, transparent: true, roughness: .85, side: THREE.DoubleSide });
    this.materials.set('banner-emblem', this.bannerMaterial);
    this.lampSpriteMaterial = new THREE.SpriteMaterial({ map: this.moteTexture, color: '#ffb865', transparent: true, opacity: .28, blending: THREE.AdditiveBlending, depthWrite: false });
    this.materials.set('lamp-halo', this.lampSpriteMaterial);
    this.hemi = new THREE.HemisphereLight('#b1c9df', '#405341', 1.35);
    this.key = new THREE.DirectionalLight('#dbe4ed', 3.7);
    this.key.position.set(-12, 28, 16); this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    this.key.shadow.camera.left = -23; this.key.shadow.camera.right = 23; this.key.shadow.camera.top = 23; this.key.shadow.camera.bottom = -23;
    this.key.shadow.camera.near = .1; this.key.shadow.camera.far = 90;
    this.key.shadow.bias = -.00025; this.key.shadow.normalBias = .025; this.key.shadow.radius = 4;
    this.rim = new THREE.DirectionalLight('#86b7bd', 1.35); this.rim.position.set(-15, 12, -25);
    this.heroLight = new THREE.PointLight('#b5e8df', 2.5, 7, 2); this.heroLight.position.set(1.4, 3.5, 13.4);
    this.fill = new THREE.DirectionalLight('#f1d8b5', .72);this.fill.position.set(18,15,20);this.scene.add(this.fill);
    this.scene.add(this.hemi, this.key, this.key.target, this.rim, this.heroLight);
    this.lampLights = Array.from({length: 5}, () => { const light = new THREE.PointLight('#ffb56d', 14, 8, 2); this.scene.add(light); return light; });
    this.initEnvironment();
    this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2(); this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.selection = this.mesh(this.fxRoot, this.geom.ring, this.basic('#ffd98c', .82), [0, .035, 0], [1.1, 1, 1.1]); this.selection.visible = false;
    this.initPost();
    this.resize();
    this.resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.resize()) : null;
    this.resizeObserver?.observe(canvas);
  }

  material(hex, metalness = 0, roughness = .7, glow = 0, map = null) {
    const key = `${hex}:${metalness}:${roughness}:${glow}:${!!map}`;
    if (!this.materials.has(key)) {
      const m = new THREE.MeshStandardMaterial({ color: hex, metalness, roughness, emissive: glow ? hex : '#000000', emissiveIntensity: glow, map, envMapIntensity: metalness > .4 ? 1.1 : .5 });
      if(metalness>=.45&&!glow)m.color.multiplyScalar(1.5);
      if (map === this.stoneTexture) { m.userData.surface = 'stone'; this.applySurface(m, 'stone'); }
      else if (!map && !glow && metalness >= .45) { m.userData.surface = 'bronze'; this.applySurface(m, 'bronze'); }
      this.materials.set(key, m);
    }
    return this.materials.get(key);
  }

  basic(hex, opacity = 1, additive = false) {
    const key = `b:${hex}:${opacity}:${additive}`;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshBasicMaterial({ color: hex, transparent: opacity < 1 || additive, opacity, depthWrite: opacity === 1 && !additive, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide }));
    return this.materials.get(key);
  }

  mesh(parent, geometry, material, position = [0, 0, 0], scale = [1, 1, 1], rotation = null) {
    const m = new THREE.Mesh(geometry, material); m.position.set(...position); m.scale.set(...scale); if (rotation) m.rotation.set(...rotation);
    m.castShadow = !material.transparent && material.type !== 'MeshBasicMaterial'; m.receiveShadow = !material.transparent; parent.add(m); return m;
  }

  box(parent, material, x, y, z, w, h, d, bevel = false) { return this.mesh(parent, bevel ? this.geom.bevel : this.geom.box, material, [x, y, z], [w, h, d]); }
  sphere(parent, material, x, y, z, w, h = w, d = w) { return this.mesh(parent, this.geom.sphere, material, [x, y, z], [w, h, d]); }
  cyl(parent, material, x, y, z, radius, height) { return this.mesh(parent, this.geom.cylinder, material, [x, y, z], [radius, height, radius]); }

  between(parent, material, a, b, radius = .06, tapered = false) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), direction = end.clone().sub(start);
    const mesh = this.mesh(parent, tapered ? this.geom.tapered : this.geom.cylinder, material);
    mesh.position.copy(start.add(end).multiplyScalar(.5)); mesh.scale.set(radius, direction.length(), radius);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()); return mesh;
  }

  initEnvironment() {
    const room = new THREE.Scene(); room.background = new THREE.Color('#354253');
    const shell = new THREE.Mesh(new THREE.BoxGeometry(32, 24, 32), new THREE.MeshBasicMaterial({color:'#495568',side:THREE.BackSide})); room.add(shell);
    const fixtures = [
      {p:[-8,10,3],s:[6,2,12],c:'#cbdff7',power:3.5},
      {p:[7,4,10],s:[5,8,1],c:'#d3aa77',power:2},
      {p:[2,3,-12],s:[7,4,1],c:'#5c9bba',power:1.3},
      {p:[-9,-6,0],s:[8,1,10],c:'#2d3d30',power:.7},
    ];
    for (const f of fixtures) { const mat = new THREE.MeshBasicMaterial({color:new THREE.Color(f.c).multiplyScalar(f.power)}); const m = new THREE.Mesh(new THREE.BoxGeometry(...f.s),mat); m.position.set(...f.p); room.add(m); }
    const generator = new THREE.PMREMGenerator(this.renderer); generator.compileCubemapShader();
    this.environmentTarget = generator.fromScene(room,.07,.1,100); this.scene.environment = this.environmentTarget.texture;
    generator.dispose(); room.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
  }

  initArtMaterials() {
    this.surfaceMaps = {};
    this.fabricTexture = canvasTexture(256,(ctx,n)=>{
      const random=rng(442);ctx.fillStyle='#b6b1a3';ctx.fillRect(0,0,n,n);
      for(let i=0;i<n;i++){ctx.strokeStyle=i%2?'rgba(20,20,15,.13)':'rgba(255,252,225,.15)';ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,n);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(n,i);ctx.stroke();}
      for(let i=0;i<1800;i++){ctx.fillStyle=`rgba(20,20,10,${random()*.12})`;ctx.fillRect(random()*n,random()*n,1,1+random()*4);}
    });
    this.fabricTexture.wrapS=this.fabricTexture.wrapT=THREE.RepeatWrapping;this.fabricTexture.repeat.set(3,3);
    this.shadowTexture=canvasTexture(128,(ctx,n)=>{const g=ctx.createRadialGradient(n/2,n/2,n*.07,n/2,n/2,n/2);g.addColorStop(0,'rgba(0,0,0,.88)');g.addColorStop(.35,'rgba(0,0,0,.65)');g.addColorStop(.75,'rgba(0,0,0,.15)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,n,n);});
    this.mossTexture=canvasTexture(512,(ctx,n)=>{
      const random=rng(5271);ctx.clearRect(0,0,n,n);
      for(let i=0;i<6500;i++){const x=random()*n,y=random()*n,rad=Math.hypot((x-n/2)/(n*.49),(y-n/2)/(n*.49));if(rad>1||random()>1-rad*.65)continue;const g=55+random()*75;ctx.fillStyle=`rgba(${Math.round(g*.62)},${Math.round(g)},${Math.round(g*.53)},${(1-rad)*(.18+random()*.48)})`;ctx.beginPath();ctx.ellipse(x,y,2+random()*14,1+random()*9,random()*TAU,0,TAU);ctx.fill();}
    });
    this.rugTexture=canvasTexture(1024,(ctx,n)=>{
      const random=rng(2281);ctx.fillStyle='#633e3d';ctx.fillRect(0,0,n,n);
      for(let i=0;i<25000;i++){const v=55+random()*45;ctx.fillStyle=`rgba(${v+35},${v*.8},${v*.7},.13)`;ctx.fillRect(random()*n,random()*n,2,1+random()*5);}
      for(const inset of [30,42,62,80]){ctx.strokeStyle=inset===62?'#ac8d5a':'#352f2a';ctx.lineWidth=inset===62?13:4;ctx.strokeRect(inset,inset,n-inset*2,n-inset*2);}
      ctx.strokeStyle='#b59a69';ctx.lineWidth=3;
      for(let y=98;y<n-90;y+=57)for(const x of [61,n-61]){ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x+17,y);ctx.lineTo(x,y+18);ctx.lineTo(x-17,y);ctx.closePath();ctx.stroke();}
      for(let j=0;j<3;j++){const y=222+j*290;ctx.save();ctx.translate(n/2,y);ctx.scale(1,.8);for(let k=0;k<8;k++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.moveTo(0,18);ctx.bezierCurveTo(55,50,68,122,0,150);ctx.bezierCurveTo(-68,122,-55,50,0,18);ctx.stroke();}ctx.restore();}
      ctx.globalCompositeOperation='destination-out';
      for(let i=0;i<700;i++){ctx.fillStyle=`rgba(0,0,0,${random()*.38})`;ctx.fillRect(random()*n,random()*n,2+random()*18,1+random()*7);}
      for(let i=0;i<100;i++){const y=random()*n;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(random()<.5?0:n-10,y,5+random()*15,1+random()*5);}
    });
    this.sigilTexture=canvasTexture(1024,(ctx,n)=>{
      const random=rng(918);ctx.translate(n/2,n/2);ctx.strokeStyle='rgba(180,155,100,.8)';ctx.fillStyle='rgba(180,155,100,.7)';
      for(const r of [480,474,448,442,360,354,199]){ctx.lineWidth=r===448?3:1.4;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}
      for(let i=0;i<48;i++){ctx.save();ctx.rotate(i*TAU/48);ctx.beginPath();ctx.moveTo(0,460);ctx.lineTo(0,i%4?452:433);ctx.stroke();if(i%2===0){ctx.translate(0,403);ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillText('ᚠᚱᚹᛁᛇᛉᛟ'[i%7],0,0);}ctx.restore();}
      for(let i=0;i<12;i++){ctx.save();ctx.rotate(i*TAU/12);ctx.beginPath();ctx.moveTo(0,42);ctx.bezierCurveTo(140,100,160,210,0,315);ctx.bezierCurveTo(-160,210,-140,100,0,42);ctx.stroke();ctx.restore();}
      ctx.rotate(Math.PI/4);ctx.strokeRect(-110,-110,220,220);ctx.strokeRect(-100,-100,200,200);ctx.globalCompositeOperation='destination-out';
      for(let i=0;i<3500;i++){ctx.fillStyle=`rgba(0,0,0,${.15+random()*.75})`;ctx.fillRect((random()-.5)*n,(random()-.5)*n,1+random()*8,1+random()*5);}
    });
    this.leafTexture=canvasTexture(128,(ctx,n)=>{
      const g=ctx.createLinearGradient(0,0,n,n);g.addColorStop(0,'#adc18b');g.addColorStop(.45,'#607849');g.addColorStop(1,'#233a2b');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(n/2,0);ctx.bezierCurveTo(n,32,n,93,n/2,n);ctx.bezierCurveTo(0,93,0,32,n/2,0);ctx.fill();ctx.strokeStyle='#a7b384';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(n/2,5);ctx.lineTo(n/2,n);ctx.stroke();for(let y=22;y<110;y+=19){ctx.beginPath();ctx.moveTo(n/2,y+13);ctx.lineTo(24,y-2);ctx.moveTo(n/2,y+13);ctx.lineTo(104,y-2);ctx.stroke();}
    });
    this.textures.push(this.fabricTexture,this.shadowTexture,this.mossTexture,this.rugTexture,this.sigilTexture,this.leafTexture);
    this.contactMaterial=new THREE.MeshBasicMaterial({color:'#070d0b',map:this.shadowTexture,transparent:true,opacity:.66,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});this.contactMaterial.userData.staticBatch=true;
    this.mossMaterial=new THREE.MeshStandardMaterial({color:'#87a076',map:this.mossTexture,transparent:true,alphaTest:.03,roughness:1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});this.mossMaterial.userData.staticBatch=true;
    this.leafMaterial=new THREE.MeshStandardMaterial({color:'#d8dfa2',map:this.leafTexture,alphaTest:.35,side:THREE.DoubleSide,roughness:.94,emissive:'#25381c',emissiveIntensity:.14,envMapIntensity:.5});
    this.rugMaterial=new THREE.MeshStandardMaterial({map:this.rugTexture,color:'#c1ae99',roughness:.98,transparent:true,alphaTest:.2,side:THREE.DoubleSide});
    this.sigilMaterial=new THREE.MeshStandardMaterial({map:this.sigilTexture,color:'#beb49b',roughness:.76,metalness:.32,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});this.sigilMaterial.userData.staticBatch=true;
    for(const [name,mat] of [['contact',this.contactMaterial],['moss',this.mossMaterial],['leaves',this.leafMaterial],['rug',this.rugMaterial],['sigil',this.sigilMaterial]])this.materials.set(name,mat);
    this.buildPlantGeometry();
    const loader=new THREE.TextureLoader();
    for(const [surface,file] of [['stone','stone-floor.png'],['bronze','aged-bronze.png']]){
      loader.load(new URL(`./assets/${file}`,import.meta.url).href,texture=>{
        if(this.disposed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
        const bump=texture.clone();bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;
        const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.drawImage(texture.image,0,0,256,256);const pixels=ctx.getImageData(0,0,256,256);for(let i=0;i<pixels.data.length;i+=4){const v=178+(pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/3*.29;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;}ctx.putImageData(pixels,0,0);const roughness=new THREE.CanvasTexture(canvas);roughness.colorSpace=THREE.NoColorSpace;roughness.wrapS=roughness.wrapT=THREE.RepeatWrapping;
        this.surfaceMaps[surface]={color:texture,bump,roughness};this.textures.push(texture,bump,roughness);
        for(const mat of this.materials.values())if(mat.userData.surface===surface||surface==='bronze'&&mat.userData.surface==='painted')this.applySurface(mat,mat.userData.surface);
      },undefined,()=>{/* The procedural material stays usable while optional art is unavailable. */});
    }
  }

  applySurface(material,surface) {
    const maps=this.surfaceMaps?.[surface==='painted'?'bronze':surface];
    if(surface==='painted'){material.map=null;if(maps){material.bumpMap=maps.bump;material.roughnessMap=maps.roughness;material.bumpScale=.018;}material.roughness=.56;material.needsUpdate=true;return;}
    if(maps){material.map=maps.color;material.bumpMap=maps.bump;material.roughnessMap=maps.roughness;material.bumpScale=surface==='stone'?.1:.035;material.roughness=surface==='stone'?.98:.88;}
    else if(surface==='stone'){material.map=this.stoneTexture;material.bumpMap=this.stoneTexture;material.bumpScale=.07;}
    material.needsUpdate=true;
  }

  painted(material) { material.userData.surface='painted';this.applySurface(material,'painted');return material; }

  buildPlantGeometry() {
    const vertices=[],uvs=[],normals=[],random=rng(721);
    for(let blade=0;blade<7;blade++){
      const a=random()*TAU,h=.25+random()*.5,bend=.12+random()*.22,width=.025+random()*.025;
      for(let seg=0;seg<3;seg++){
        const t0=seg/3,t1=(seg+1)/3;
        const point=(t,side)=>[Math.cos(a)*bend*t*t+Math.sin(a)*width*(1-t)*side,h*t,Math.sin(a)*bend*t*t-Math.cos(a)*width*(1-t)*side];
        const pts=[point(t0,-1),point(t0,1),point(t1,-1),point(t0,1),point(t1,1),point(t1,-1)];
        for(let j=0;j<pts.length;j++){vertices.push(...pts[j]);uvs.push(j%2,t0);normals.push(Math.cos(a),.3,Math.sin(a));}
      }
    }
    const grass=new THREE.BufferGeometry();grass.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));grass.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));grass.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));grass.computeVertexNormals();this.geom.grass=grass;this.ownedGeometries.add(grass);
    const leaf=new THREE.PlaneGeometry(.38,.7,2,4),p=leaf.attributes.position;
    for(let i=0;i<p.count;i++)p.setZ(i,Math.sin((p.getY(i)+.35)/.7*Math.PI)*.08);
    leaf.computeVertexNormals();this.geom.leaf=leaf;this.ownedGeometries.add(leaf);
    this.grassMaterials=['#5d7549','#778c50','#a2a365'].map(c=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:1,side:THREE.DoubleSide});this.materials.set(`grass-${c}`,m);return m;});
  }

  initPost() {
    this.sceneTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true });
    this.sceneTarget.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);
    this.bloomA = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
    this.bloomB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
    this.postScene = new THREE.Scene(); this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const vertexShader = 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
    this.blurMaterial = new THREE.ShaderMaterial({
      uniforms: { source: { value: null }, stepUV: { value: new THREE.Vector2() }, threshold: { value: 0 } }, vertexShader,
      fragmentShader: `varying vec2 vUv; uniform sampler2D source; uniform vec2 stepUV; uniform float threshold;
        vec3 pick(vec2 uv){vec3 c=texture2D(source,uv).rgb;float l=max(max(c.r,c.g),c.b);return c*max(0.,l-threshold)/max(.001,l);}
        void main(){vec3 c=pick(vUv)*.227027;c+=(pick(vUv+stepUV*1.384615)+pick(vUv-stepUV*1.384615))*.316216;c+=(pick(vUv+stepUV*3.230769)+pick(vUv-stepUV*3.230769))*.070270;gl_FragColor=vec4(c,1.);}`,
      depthTest: false, depthWrite: false,
    });
    this.postMaterial = new THREE.ShaderMaterial({
      uniforms: { sceneTex: { value: this.sceneTarget.texture }, depthTex:{value:this.sceneTarget.depthTexture},pixel:{value:new THREE.Vector2(1/1280,1/800)},bloomTex: { value: this.bloomB.texture }, time: { value: 0 }, bloomStrength: { value: .3 } }, vertexShader,
      fragmentShader: `varying vec2 vUv; uniform sampler2D sceneTex; uniform sampler2D bloomTex; uniform sampler2D depthTex;uniform vec2 pixel;uniform float time; uniform float bloomStrength;
        vec3 film(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
        void main(){vec3 c=texture2D(sceneTex,vUv).rgb;float depth=texture2D(depthTex,vUv).r;float ao=0.;for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 off=vec2(cos(a),sin(a))*pixel*(i<4?7.:15.);float d=depth-texture2D(depthTex,vUv+off).r;ao+=smoothstep(.00035,.003,d)*(1.-smoothstep(.012,.04,d));}c*=1.-ao*.028;c+=texture2D(bloomTex,vUv).rgb*bloomStrength;c=film(c*1.2);c=pow(c,vec3(1./2.2));float lum=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(lum),c,1.06);vec2 uv=vUv*(1.-vUv.yx);float vig=pow(clamp(uv.x*uv.y*20.,0.,1.),.15);c*=mix(.72,1.,vig);float grain=fract(sin(dot(vUv+fract(time*.07),vec2(12.9898,78.233)))*43758.5453);c+=(grain-.5)*.003;gl_FragColor=vec4(c,1.);}`,
      depthTest: false, depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial); this.postScene.add(this.quad);
  }

  resize() {
    const width = Math.max(1, this.canvas.clientWidth || window.innerWidth), height = Math.max(1, this.canvas.clientHeight || window.innerHeight);
    if (this.width === width && this.height === height) return;
    this.width = width; this.height = height; this.renderer.setSize(width, height, false);
    const ratio = this.renderer.getPixelRatio(); this.sceneTarget.setSize(Math.round(width * ratio), Math.round(height * ratio));
    this.postMaterial.uniforms.pixel.value.set(1/(width*ratio),1/(height*ratio));
    this.bloomA.setSize(Math.max(1, Math.round(width * ratio * .38)), Math.max(1, Math.round(height * ratio * .38)));
    this.bloomB.setSize(this.bloomA.width, this.bloomA.height); this.updateCameraBounds();
  }

  updateCameraBounds() {
    const aspect = this.width / Math.max(1, this.height), halfHeight = 9.7 / this.zoom;
    this.camera.left = -halfHeight * aspect; this.camera.right = halfHeight * aspect;
    this.camera.top = halfHeight; this.camera.bottom = -halfHeight; this.camera.updateProjectionMatrix();
  }

  setZoom(delta) { this.targetZoom = clamp(this.targetZoom * Math.exp(-delta * .001), .68, 1.5); }

  groundPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect(); this.mouse.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.mouse, this.camera); const hit = this.raycaster.ray.intersectPlane(this.ground, new THREE.Vector3());
    return hit ? { x: hit.x, z: hit.z } : { x: this.cameraTarget.x, z: this.cameraTarget.z };
  }

  project(x, z, y = 1) {
    v3.set(x, y, z).project(this.camera); const rect = this.canvas.getBoundingClientRect();
    return { x: rect.left + (v3.x * .5 + .5) * rect.width, y: rect.top + (-v3.y * .5 + .5) * rect.height, visible: v3.z >= -1 && v3.z <= 1 && Math.abs(v3.x) <= 1.12 && Math.abs(v3.y) <= 1.12 };
  }

  clearGroup(group) { while (group.children.length) { const child=group.children[0]; child.traverse(node=>{if(node.isInstancedMesh)node.dispose();}); group.remove(child); } }

  load(state) {
    this.state = state;
    this.clearGroup(this.staticRoot); this.clearGroup(this.actorRoot);
    for (const material of this.levelMaterials) material.dispose();
    this.levelMaterials.clear();
    for (const geometry of this.levelGeometries) geometry.dispose();
    this.levelGeometries.clear();this.lanternPositions=[];
    for (const m of this.effectModels.values()) { this.fxRoot.remove(m.group); m.material?.dispose(); }
    this.effectModels.clear(); this.entities.clear(); this.objectModels.clear(); this.dropModels.clear();
    if (this.motes) { this.scene.remove(this.motes); this.motes.geometry.dispose(); this.motes.material.dispose(); }
    this.pal = palettes[(state.chapter || 0) % palettes.length]; const p = this.pal;
    this.scene.background = new THREE.Color(p.sky); this.scene.fog = new THREE.FogExp2(p.sky, .016);
    this.hemi.color.set(state.chapter >= 6 ? '#c1c9ff' : '#a3c7df'); this.rim.color.set(p.glow); this.heroLight.color.set(p.glow);
    this.stone = this.material(state.chapter>=6?'#c5cbd2':'#bbc2b5', .06, .94, 0, this.stoneTexture);
    this.darkStone = this.material('#81958b', .06, .94, 0, this.stoneTexture);
    this.metal = this.material(state.chapter>=6?'#9094a7':'#6c817d', .62, .59);
    this.brass = this.material('#b6a083', .68, .54);
    this.edge = this.material('#18272e', .56, .48);
    this.glow = this.material(p.glow, .1, .32, 4.6);
    this.warm = this.material('#ffd49b', .2, .25, 5.5);
    this.red = this.material(p.accent, .45, .4);
    this.buildWorld(state);
    this.staticRoot.updateMatrixWorld(true);
    this.lanternPositions=this.lanternPositions.map(p=>p.position.applyMatrix4(p.parent.matrixWorld));
    this.batchStatic(this.staticRoot);
    this.buildAtmosphere(state);
    this.cameraTarget.set(state.player?.x || 0, 0, (state.player?.z ?? 12) - 1.8);
    this.camera.position.copy(this.cameraTarget).add(this.cameraOffset); this.camera.lookAt(this.cameraTarget);
    this.syncActors(state, 0); this.syncObjects(state, 0); this.syncDrops(state, 0);
    this.scene.updateMatrixWorld(true);
  }

  batchStatic(root) {
    root.updateMatrixWorld(true); const buckets = new Map(), removed = [];
    root.traverse(o => {
      if (!o.isMesh || o.userData.dynamic || Array.isArray(o.material) || o.material.transparent&&!o.material.userData.staticBatch) return;
      const key = `${o.geometry.uuid}:${o.material.uuid}:${o.castShadow}:${o.receiveShadow}`;
      if (!buckets.has(key)) buckets.set(key, { geo: o.geometry, mat: o.material, cast: o.castShadow, receive: o.receiveShadow, matrices: [] });
      buckets.get(key).matrices.push(o.matrixWorld.clone()); removed.push(o);
    });
    for (const o of removed) o.removeFromParent();
    for (const b of buckets.values()) {
      const instances = new THREE.InstancedMesh(b.geo, b.mat, b.matrices.length);
      b.matrices.forEach((m, i) => instances.setMatrixAt(i, m)); instances.castShadow = b.cast; instances.receiveShadow = b.receive;
      instances.computeBoundingSphere(); root.add(instances);
    }
  }

  buildWorld(state) {
    const root = this.staticRoot, size = state.map?.size || 40, half = size / 2, random = rng(state.map?.seed || 17);
    this.box(root, this.darkStone, 0, -.66, 0, size + 1.3, 1.2, size + 1.3, true);
    this.box(root, this.brass, 0, -.14, 0, size + .7, .12, size + .7);
    this.box(root, this.darkStone, 0, -.11, 0, size + .3, .18, size + .3);
    const floorMats = Array.from({ length: 7 }, (_, i) => { const c = new THREE.Color(state.chapter>=6?'#c1c7d3':'#b6bcac').multiplyScalar(.75 + i * .055); return this.material(`#${c.getHexString()}`, .06, .94, 0, this.stoneTexture); });
    for (let x = -half + 1; x < half; x += 2) {
      for (let z = -half + 1; z < half; z += 2) {
        const tile = this.box(root, floorMats[Math.floor(random() * floorMats.length)], x, -.045 + random() * .022, z, 1.97, .12, 1.97, true);
        tile.rotation.y = Math.floor(random() * 4) * Math.PI / 2;
        if (Math.abs(x) < 2 && random() > .8) { this.box(root, this.brass, x, .034, z, .012, .01, 1.72); this.box(root, this.brass, x, .034, z, 1.72, .01, .012); }
        if (random() < .13 && Math.abs(x) > 3) this.box(root, this.edge, x + .5, .035, z + .3, .025, .012, .5 + random() * .8).rotation.y = random() * Math.PI;
        if(Math.abs(x)>3&&random()<.26){this.groundDecal(root,this.mossMaterial,x+random()-.5,z+random()-.5,1.8+random()*1.4);for(let i=0;i<2;i++)this.grass(root,x+(random()-.5)*1.5,z+(random()-.5)*1.5,.28+random()*.35,random);}
      }
    }
    for (const x of [-half + 2.7, -4.1, 4.1, half - 2.7]) {
      this.box(root, this.edge, x, .045, 0, .15, .025, size - 1);
      this.box(root, this.brass, x - .13, .048, 0, .018, .02, size - 1);
      this.box(root, this.brass, x + .13, .048, 0, .018, .02, size - 1);
      for (let z = -half + 1; z < half - 1; z += 3) this.box(root, this.glow, x, .065, z, .018, .012, .45);
    }
    for (const z of [-half + 3, -8, 2, 12, half - 2]) {
      this.box(root, this.brass, 0, .052, z, size - 1.2, .012, .024);
      for (let x = -half + 1; x < half; x += .5) { if (Math.abs(x) > 4.3) this.box(root, this.metal, x, .055, z + .4, .18, .025, .38); }
    }
    this.floorMedallion(root, 0, 1.8, 3.2);
    this.floorMedallion(root, 0, -15.5, 3.7);
    for(const z of [11,-6])this.mesh(root,this.geom.plane,this.rugMaterial,[0,.085,z],[3.4,6.6,1],[-Math.PI/2,0,0]);
    for (const obstacle of state.map?.obstacles || []) this.buildObstacle(obstacle);
    this.buildAisles(state);
    for (let i = -half + 2; i < half; i += 6) {
      this.boundaryPillar(-half - .1, i, 4.6 + random() * 1.3);
      this.boundaryPillar(i, -half - .1, 4.6 + random() * 1.3);
      this.boundaryPillar(half + .1, i, 1.35);
      this.boundaryPillar(i, half + .1, 1.35);
      if (i < half - 4) {
        this.arcade(-half - .1, i + 3, Math.PI / 2);
        this.arcade(i + 3, -half - .1, 0);
        this.box(root, this.darkStone, half + .1, .32, i + 3, .9, .64, 4.9, true);
        this.box(root, this.brass, half + .1, .67, i + 3, 1, .09, 4.9);
        this.box(root, this.darkStone, i + 3, .32, half + .1, 4.9, .64, .9, true);
        this.box(root, this.brass, i + 3, .67, half + .1, 4.9, .09, 1);
      }
    }
    for (const side of [-1, 1]) {
      for (const z of [-14, -2, 10]) {
        this.lantern(root, side * (half - .7), z, 1.9);
        this.box(root, this.metal, side * (half + 2.1), 1.5, z, 1.8, 3, 3.4, true);
        for (let k = 0; k < 8; k++) this.box(root, this.brass, side * (half + 2.1), .5 + k * .32, z, 1.88, .08, 3.5);
      }
    }
    this.box(root, this.darkStone, 0, -.28, half + 3.2, 5.4, .5, 6.5);
    for (let i = 0; i < 5; i++) this.box(root, this.stone, 0, -.1 - i * .16, half + 1.2 + i * .75, 6.2 + i * .3, .25, .8, true);
    for (let i = 0; i < 34; i++) {
      const x = (random() - .5) * 115, z = -half - 10 - random() * 35, h = 7 + random() * 17;
      this.box(root, this.material('#152631', .3, .8), x, h / 2 - 6, z, 3 + random() * 4, h, 3 + random() * 4, true);
      if(i%2===0){this.mesh(root,this.geom.cone,this.material('#1b2b35',.25,.8),[x,h-4,z],[2.7,6+random()*6,2.7]);for(const s of [-1,1])this.mesh(root,this.geom.cone,this.material('#1c2b36',.2,.85),[x+s*2.3,h-4.5,z],[.65,4.8,.65]);}
      if (i % 3 === 0) for (let k = 0; k < 6; k++) this.box(root, this.material(this.pal.glow, .1, .5, .6), x, h / 2 - 3 + k * .7, z + 2.7, 1.4, .08, .02);
    }
    // A dark, reflective lower world makes the fortress feel suspended above a vast machine.
    this.box(root, this.material('#102733', .65, .35), 0, -4.5, 0, 160, .1, 160);
    this.dressCourtyard(root,half,random,state);
  }

  floorMedallion(parent, x, z, radius) {
    this.mesh(parent,this.geom.plane,this.sigilMaterial,[x,.087,z],[radius*2,radius*2,1],[-Math.PI/2,0,0]);
    for (const r of [radius, radius-.08]) this.mesh(parent, this.geom.thinRing, this.brass, [x, .078, z], [r, 1, r]);
    for (let i = 0; i < 16; i++) {
      const a = i * TAU / 16; const m = this.box(parent, i % 4 === 0 ? this.glow : this.brass, x + Math.sin(a) * radius * .93, .083, z + Math.cos(a) * radius * .93, .025, .01, .12);
      m.rotation.y = a;
    }
  }

  buildAisles(state) {
    // The high side aisles frame the court without putting any new collider or
    // low beam into the central combat lane. All spans join existing columns.
    if(!this.aisleGeometry){
      const s=new THREE.Shape();s.moveTo(-3.5,3.25);s.lineTo(-3.5,4.05);s.bezierCurveTo(-3.35,5.03,-1.6,5.9,0,6.62);s.bezierCurveTo(1.6,5.9,3.35,5.03,3.5,4.05);s.lineTo(3.5,3.25);s.lineTo(3.1,3.25);s.lineTo(3.1,4.0);s.bezierCurveTo(2.98,4.77,1.45,5.5,0,6.15);s.bezierCurveTo(-1.45,5.5,-2.98,4.77,-3.1,4.0);s.lineTo(-3.1,3.25);s.closePath();
      this.aisleGeometry=new THREE.ExtrudeGeometry(s,{depth:.4,steps:1,bevelEnabled:true,bevelThickness:.045,bevelSize:.045,bevelSegments:2});this.aisleGeometry.translate(0,0,-.2);this.ownedGeometries.add(this.aisleGeometry);
      this.aisleCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-3.3,3.3,.245),new THREE.Vector3(-3.28,4.05,.245),new THREE.Vector3(-1.8,5.5,.245),new THREE.Vector3(0,6.38,.245),new THREE.Vector3(1.8,5.5,.245),new THREE.Vector3(3.28,4.05,.245),new THREE.Vector3(3.3,3.3,.245)]);
      this.aisleRibGeometry=new THREE.TubeGeometry(this.aisleCurve,48,.025,6,false);this.ownedGeometries.add(this.aisleRibGeometry);
    }
    for(const side of [-1,1]){
      const columns=(state.map.obstacles||[]).filter(o=>o.type==='pillar'&&Math.abs(o.x-side*7.5)<1).sort((a,b)=>a.z-b.z);
      for(let i=1;i<columns.length;i++){
        const span=columns[i].z-columns[i-1].z;if(span>8||span<4)continue;
        const group=new THREE.Group();group.position.set(side*7.82,0,(columns[i].z+columns[i-1].z)/2);group.rotation.y=Math.PI/2;group.scale.x=span/7;this.staticRoot.add(group);
        this.mesh(group,this.aisleGeometry,this.stone);this.mesh(group,this.aisleRibGeometry,this.brass);
        for(let k=1;k<16;k++){const t=k/16,p=this.aisleCurve.getPointAt(t),tangent=this.aisleCurve.getTangentAt(t),m=this.box(group,this.darkStone,p.x,p.y,.13,.06,.34,.35,true);m.rotation.z=Math.atan2(tangent.y,tangent.x)-Math.PI/2;}
        this.box(group,this.brass,0,6.35,.29,.25,.46,.07,true);
        this.mesh(group,this.geom.oct,this.glow,[0,6.35,.34],[.055,.115,.03]);
        for(const s of [-1,1]){this.mesh(group,this.geom.cone,this.stone,[s*3.4,4.48,0],[.16,.8,.16]);this.cyl(group,this.brass,s*3.4,4.05,0,.2,.08);}
        if(i%2){
          const bannerMat=this.material('#6e343b',.02,.98,0,this.fabricTexture);bannerMat.side=THREE.DoubleSide;
          const bannerGeo=this.bannerGeometry||this.geom.plane;const banner=this.mesh(group,bannerGeo,bannerMat,[0,4.72,.25],this.bannerGeometry?[.82,1,1]:[1.05,2.15,1]);banner.castShadow=true;
          this.mesh(group,this.geom.plane,this.bannerMaterial,[0,4.85,.32],[.85,.85,1]);this.box(group,this.brass,0,5.86,.26,1.35,.055,.055);
        }
        this.ivy(group,-2.1,5.4,.29,1.35,Math.round(group.position.z*17+side*41+1300));
      }
    }
  }

  groundDecal(parent,material,x,z,size,aspect=1,y=.079) {
    const m=this.mesh(parent,this.geom.plane,material,[x,y,z],[size,size*aspect,1],[-Math.PI/2,0,0]);m.castShadow=false;m.receiveShadow=material.isMeshStandardMaterial;return m;
  }

  grass(parent,x,z,scale,random=rng(71)) {
    const g=this.mesh(parent,this.geom.grass,this.grassMaterials[Math.floor(random()*this.grassMaterials.length)],[x,.04,z],[scale,scale,scale]);g.rotation.y=random()*TAU;g.castShadow=false;return g;
  }

  ivy(parent,x,y,z,height=2,seed=1) {
    const random=rng(seed),stem=this.material('#3b4c31',0,1);let prev=[x,y,z];
    for(let i=0;i<Math.ceil(height/.22);i++){
      const t=i*.22,next=[x+Math.sin(i*.7)*.12,y-t,z+Math.sin(i*.4)*.04];
      this.between(parent,stem,prev,next,.012);prev=next;
      for(const side of [-1,1]){const leaf=this.mesh(parent,this.geom.leaf,this.leafMaterial,[next[0]+side*(.1+random()*.08),next[1]-.04,next[2]+.02],[.45+random()*.28,.45+random()*.35,.65],[.1+random()*.5,side*.25,side*(.5+random()*.45)]);leaf.castShadow=false;}
    }
  }

  fern(parent,x,z,size,random) {
    for(let f=0;f<5;f++){
      const a=f*TAU/5+random()*.3;
      for(let i=0;i<5;i++){
        const t=(i+1)/5,xx=x+Math.cos(a)*t*size*.7,zz=z+Math.sin(a)*t*size*.7,y=.1+Math.sin(t*Math.PI*.8)*size*.6;
        for(const side of [-1,1]){const m=this.mesh(parent,this.geom.leaf,this.leafMaterial,[xx+Math.sin(a)*side*.1,y,zz-Math.cos(a)*side*.1],[size*(1-t*.65)*.5,size*(1-t*.5)*.55,size],[Math.PI/2-.6,a+side*.5,0]);m.castShadow=false;}
      }
    }
  }

  ancientTree(parent,x,z,scale,seed) {
    const random=rng(seed),bark=this.material('#5c6051',.03,.97,0,this.stoneTexture),group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(scale);parent.add(group);
    this.groundDecal(group,this.contactMaterial,0,0,6,1,.04);this.groundDecal(group,this.mossMaterial,0,0,6,1,.07);
    const points=[[0,0,0],[.14,1.5,.1],[-.2,3,.18],[.05,4.2,-.12],[.5,5.4,-.3]];
    for(let i=1;i<points.length;i++)this.between(group,bark,points[i-1],points[i],.58-i*.075,true);
    for(let i=0;i<7;i++){const a=i*TAU/7;this.between(group,bark,[0,.4,0],[Math.cos(a)*(1.2+random()),.04,Math.sin(a)*(1.2+random())],.2,true);}
    for(let branch=0;branch<9;branch++){
      const a=branch*2.399,h=2.6+random()*2.3,r=1.5+random()*1.4,end=[Math.cos(a)*r,h+.8,Math.sin(a)*r],mid=[Math.cos(a)*r*.55,h+.25,Math.sin(a)*r*.55];
      this.between(group,bark,[0,h-.8,0],mid,.19,true);this.between(group,bark,mid,end,.11,true);
      for(let j=0;j<17;j++){
        const xx=end[0]+(random()-.5)*1.8,yy=end[1]+(random()-.5)*1.1,zz=end[2]+(random()-.5)*1.8;
        const leaf=this.mesh(group,this.geom.leaf,this.leafMaterial,[xx,yy,zz],[1.2+random(),1.1+random(),1],[random()*Math.PI,random()*TAU,random()*Math.PI]);leaf.castShadow=j%3===0;
      }
    }
    for(let i=0;i<4;i++)this.ivy(group,(random()-.5)*.6,3+random()*1.5,.35,1.7+random(),seed+i);
  }

  dressCourtyard(root,half,random,state) {
    const rubble=this.material('#7b8174',.02,.97,0,this.stoneTexture);
    for(let side=-1;side<=1;side+=2){
      for(let z=-half+1;z<half;z+=1.3){
        const x=side*(half-.5-random()*.9);this.groundDecal(root,this.mossMaterial,x,z,2.4+random()*2);
        for(let j=0;j<4;j++)this.grass(root,x+(random()-.5)*1.2,z+(random()-.5)*1.1,.65+random()*.6,random);
        if(random()<.24)this.fern(root,x,z,.65+random()*.45,random);
        if(random()<.4){const rock=this.mesh(root,this.geom.ico,rubble,[x,.11,z],[.1+random()*.22,.1+random()*.14,.1+random()*.3]);rock.rotation.set(random(),random()*TAU,random());}
      }
      for(const z of [-13,6,17])this.ancientTree(root,side*(half+1.7),z,.85+random()*.3,Math.floor(random()*9999));
    }
    // Lower masonry terraces and hanging gardens make the arena a place, not a board.
    for(const side of [-1,1])for(let tier=0;tier<3;tier++){
      const edge=half+1.1+tier*1.1,y=-.8-tier*1.1;
      this.box(root,this.darkStone,side*edge,y,0,1.3,.8,half*2+2,true);
      this.box(root,this.stone,0,y,side*edge,half*2+2,.8,1.3,true);
      for(let z=-half+2;z<half;z+=4)this.ivy(root,side*(edge+.67),y+.45,z,1.6+tier*.3,Math.round(z*7+tier+200));
    }
    for(const o of state.map.obstacles){
      this.groundDecal(root,this.contactMaterial,o.x,o.z,Math.max(o.w,o.d)*2.1,1,.067);
      this.groundDecal(root,this.mossMaterial,o.x+.3,o.z+.4,Math.max(o.w,o.d)*2.5,1,.077);
      for(let j=0;j<12;j++){const a=random()*TAU;this.grass(root,o.x+Math.cos(a)*o.w*.65,o.z+Math.sin(a)*o.d*.65,.75+random()*.7,random);}
      this.fern(root,o.x-o.w*.5,o.z+o.d*.45,1.1,random);
      this.fern(root,o.x+o.w*.5,o.z+o.d*.25,.85,random);
    }
    for(const [x,z] of [[-6,16],[7,16],[-12,12],[12,12],[-16,5],[16,5]]){this.groundDecal(root,this.mossMaterial,x,z,3);this.fern(root,x,z,1.25,random);this.fern(root,x+.5,z+.3,.95,random);for(let j=0;j<8;j++)this.grass(root,x+(random()-.5)*2,z+(random()-.5)*2,.8+random()*.8,random);}
    // Broken slate, autumn leaves, and tiny mushrooms are low enough to walk over.
    const leafMat=this.material('#92694a',0,.95),mushroom=this.material('#9b7358',0,.92);
    for(let i=0;i<180;i++){
      const x=(random()-.5)*(half*2-2),z=(random()-.5)*(half*2-2);if(Math.abs(x)<2.3)continue;
      if(i%4===0){const m=this.mesh(root,this.geom.ico,rubble,[x,.045,z],[.04+random()*.08,.025,.07+random()*.12]);m.rotation.y=random()*TAU;m.castShadow=false;}
      else {const m=this.mesh(root,this.geom.leaf,leafMat,[x,.055,z],[.15,.2,.15],[-Math.PI/2,0,random()*TAU]);m.castShadow=false;}
      if(i<12&&Math.abs(x)>15){this.cyl(root,mushroom,x,.13,z,.025,.19);this.sphere(root,mushroom,x,.23,z,.13,.055,.13);}
    }
  }

  boundaryPillar(x, z, h) {
    const root = this.staticRoot;
    this.box(root, this.darkStone, x, .2, z, 1.8, .4, 1.8, true);
    this.box(root, this.brass, x, .43, z, 1.58, .09, 1.58);
    this.box(root, this.stone, x, h / 2 + .4, z, 1.12, h, 1.12, true);
    for (const s of [-1, 1]) { this.box(root, this.brass, x + s * .45, h / 2 + .4, z + .57, .07, h - .2, .06); this.box(root, this.metal, x + .57, h / 2 + .4, z + s * .45, .06, h - .2, .07); }
    this.box(root, this.brass, x, h + .35, z, 1.45, .12, 1.45);
    this.box(root, this.darkStone, x, h + .55, z, 1.55, .3, 1.55, true);
    for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const xx=x+Math.cos(a)*.53,zz=z+Math.sin(a)*.53;this.cyl(root,this.stone,xx,h*.5+.3,zz,.12,h*.95);this.cyl(root,this.brass,xx,h+.22,zz,.17,.1);}
    this.groundDecal(root,this.contactMaterial,x,z,3.6,1,.068);
    if (h > 3) { this.mesh(root, this.geom.cone, this.metal, [x, h + 1.15, z], [.65, 1.1, .65]); this.sphere(root, this.glow, x, h + 1.8, z, .14); }
    else this.lantern(root, x, z, h + .6);
  }

  arcade(x, z, angle) {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = angle; this.staticRoot.add(group);
    this.box(group, this.darkStone, 0, .65, 0, 5.1, 1.3, .7, true);
    this.box(group, this.brass, 0, 1.3, 0, 5.1, .09, .8);
    if (!this.archGeometry) {
      const arch = new THREE.Shape(); arch.moveTo(-2.55, 4.9); arch.lineTo(2.55, 4.9); arch.lineTo(2.55, 1.3); arch.lineTo(2.1, 1.3); arch.lineTo(2.1, 2.7); arch.bezierCurveTo(2.1, 3.65, 1.2, 4.3, 0, 4.55); arch.bezierCurveTo(-1.2, 4.3, -2.1, 3.65, -2.1, 2.7); arch.lineTo(-2.1, 1.3); arch.lineTo(-2.55, 1.3); arch.closePath();
      this.archGeometry = new THREE.ExtrudeGeometry(arch, { depth: .7, bevelEnabled: false }); this.archGeometry.translate(0, 0, -.35); this.ownedGeometries.add(this.archGeometry);
    }
    this.mesh(group, this.archGeometry, this.stone);
    this.box(group, this.brass, 0, 4.91, 0, 5.1, .12, .83);
    for(const s of [-1,1]){this.cyl(group,this.stone,s*2.35,2.75,.38,.18,2.8);this.cyl(group,this.brass,s*2.35,4.17,.38,.24,.11);this.mesh(group,this.geom.cone,this.stone,[s*2.3,5.5,0],[.27,1.1,.27]);}
    for(let i=0;i<12;i++){const a=Math.PI*i/11;const xx=Math.cos(a)*2.07,yy=2.7+Math.sin(a)*1.57;const stone=this.box(group,this.stone,xx,yy,.43,.32,.24,.15,true);stone.rotation.z=a-Math.PI/2;}
    for (const i of [-1, 0, 1]) this.box(group, this.metal, i * .8, 2.5, -.2, .05, 2.4, .06);
    this.box(group, this.glow, 0, 1.42, .37, 3.8, .035, .035);
    if(!this.bannerGeometry){this.bannerGeometry=new THREE.PlaneGeometry(1.25,2.15,8,12);const p=this.bannerGeometry.attributes.position;for(let i=0;i<p.count;i++){const yy=p.getY(i);p.setZ(i,Math.sin(p.getX(i)*13)*.045*(1.1-yy/2)+Math.sin(yy*5)*.025);if(yy<-.9)p.setY(i,yy+Math.sin(p.getX(i)*23)*.035);}this.bannerGeometry.computeVertexNormals();this.ownedGeometries.add(this.bannerGeometry);}
    const bannerMat=this.material('#6e343b',.02,.98,0,this.fabricTexture);bannerMat.side=THREE.DoubleSide;
    const banner = this.mesh(group, this.bannerGeometry, bannerMat, [0, 3.38, .42]);
    this.mesh(group, this.geom.plane, this.bannerMaterial, [0, 3.4, .43], [1.12, 1.12, 1]);
    banner.castShadow = false;
    this.box(group, this.brass, 0, 4.52, .43, 1.5, .07, .07);
    this.ivy(group,1.5,4.7,.5,2.1,Math.round(x*7+z*17+300));
  }

  lantern(parent, x, z, h) {
    this.lanternPositions.push({parent,position:new THREE.Vector3(x,h+.2,z)});
    this.cyl(parent, this.brass, x, h - .15, z, .17, .12);
    this.cyl(parent, this.warm, x, h + .09, z, .105, .38);
    this.cyl(parent, this.metal, x, h + .34, z, .2, .11);
    this.mesh(parent, this.geom.cone, this.brass, [x, h + .48, z], [.24, .24, .24]);
    for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) this.box(parent, this.brass, x + Math.cos(a) * .11, h + .08, z + Math.sin(a) * .11, .025, .4, .025);
    const sprite = new THREE.Sprite(this.lampSpriteMaterial);
    sprite.position.set(x, h + .08, z); sprite.scale.set(2.2, 2.2, 1); parent.add(sprite);
    const flame=this.mesh(parent,this.geom.sphere,this.warm,[x,h+.14,z],[.058,.2,.058]);flame.castShadow=false;
  }

  buildObstacle(o) {
    const group = new THREE.Group(); group.position.set(o.x, 0, o.z); this.staticRoot.add(group);
    const w = o.w || 1.8, d = o.d || 1.8;
    if (o.type === 'server') {
      const h = 2.8 + ((Math.abs(o.x * 7 + o.z * 3) % 5) * .2);
      this.box(group, this.edge, 0, .16, 0, w, .32, d, true);
      this.box(group, this.metal, 0, h / 2 + .25, 0, w * .87, h, d * .83, true);
      this.box(group, this.edge, 0, h / 2 + .2, d * .43, w * .68, h * .85, .09);
      for (let y = .58; y < h; y += .37) {
        this.box(group, this.darkStone, 0, y, d * .47, w * .66, .25, .12, true);
        this.box(group, this.glow, -w * .21, y, d * .54, .07, .07, .035);
        this.box(group, this.warm, -w * .11, y, d * .54, .035, .035, .035);
        this.box(group, this.metal, w * .12, y, d * .54, w * .25, .035, .04);
      }
      for (const s of [-1, 1]) {
        this.box(group, this.brass, s * w * .4, h / 2 + .23, d * .44, .065, h, .1);
        this.box(group, this.glow, s * w * .425, h * .52, 0, .025, h * .62, d * .68);
      }
      this.box(group, this.brass, 0, h + .27, 0, w * .94, .12, d * .95);
      for (let i = 0; i < 3; i++) this.cyl(group, this.edge, (i - 1) * w * .2, h + .4, 0, w * .08, .15);
      this.box(group, this.glow, 0, .35, d * .52, w * .7, .035, .035);
      for(const side of [-1,1]){
        this.cyl(group,this.brass,side*w*.42,h*.5+.2,d*.47,.105,h);
        for(let y=.45;y<h;y+=.65)this.cyl(group,this.metal,side*w*.42,y,d*.47,.15,.09);
        this.mesh(group,this.geom.cone,this.metal,[side*w*.42,h+.76,d*.35],[.21,.85,.21]);
        this.box(group,this.edge,side*w*.448,h*.5,0,.07,h*.72,d*.55,true);
        for(let i=0;i<3;i++){
          const ring=this.mesh(group,this.geom.torus,this.brass,[side*w*.49,.8+i*.8,0],[d*.22,.25,.25],[0,Math.PI/2,0]);
          this.sphere(group,this.metal,side*w*.5,.8+i*.8,0,.09,.09,.09);
        }
      }
      this.box(group,this.stone,0,h+.37,0,w*1.04,.16,d*1.04,true);
      const roof=this.mesh(group,this.geom.cone,this.metal,[0,h+.74,0],[w*.68,.66,d*.58]);roof.rotation.y=Math.PI/4;
      for(let i=0;i<12;i++){const side=i%2?-1:1;this.sphere(group,this.brass,side*w*.33,.5+Math.floor(i/2)*.46,d*.545,.034);}
      this.ivy(group,w*.39,h+.5,d*.5,h*.75,Math.round(o.x*77+o.z*39+921));
    } else if (o.type === 'tree') {
      this.box(group, this.darkStone, 0, .25, 0, w, .5, d, true);
      this.box(group, this.brass, 0, .53, 0, w * 1.03, .08, d * 1.03);
      this.cyl(group, this.material('#544e46', .5, .6), 0, 1.8, 0, .2, 2.6);
      const random = rng(o.x * 774 + o.z * 67);
      for (let i = 0; i < 7; i++) {
        const a = i * 2.399, y = 1.8 + random() * 1.5, xx = Math.cos(a) * w * .29, zz = Math.sin(a) * d * .29;
        this.mesh(group, this.geom.ico, this.material(i % 2 ? '#4e8584' : '#78a7a1', .4, .7, .15), [xx, y, zz], [w * .38, .35, d * .38]);
        this.sphere(group, this.glow, xx, y + .1, zz, .08);
      }
    } else if (o.type === 'wall') {
      const h = 1.5;
      this.box(group, this.darkStone, 0, h / 2, 0, w, h, d, true);
      for (let y = .24; y < h; y += .44) this.box(group, this.stone, 0, y, 0, w + .04, .38, d + .04, true);
      this.box(group, this.brass, 0, h + .04, 0, w + .1, .1, d + .1);
      this.box(group, this.metal, 0, h + .16, 0, w + .18, .15, d + .18, true);
      this.lantern(group, -w * .3, 0, h + .4); if (w > 3) this.lantern(group, w * .3, 0, h + .4);
    } else {
      const h = 3.1;
      this.box(group, this.darkStone, 0, .14, 0, w, .28, d, true);
      this.box(group, this.stone, 0, .34, 0, w*.88, .18, d*.88, true);
      this.box(group, this.brass, 0, .46, 0, w * .83, .07, d * .83);
      this.cyl(group,this.stone,0,1.8,0,w*.31,2.62);
      for(let i=0;i<8;i++){const a=i*TAU/8;this.cyl(group,this.darkStone,Math.cos(a)*w*.27,1.8,Math.sin(a)*d*.27,w*.045,2.5);}
      for (const s of [-1, 1]) {
        for(const t of [-1,1]){this.cyl(group,this.stone,s*w*.32,1.8,t*d*.32,w*.075,2.5);this.cyl(group,this.brass,s*w*.32,2.98,t*d*.32,w*.11,.11);}
      }
      this.cyl(group,this.stone,0,h+.1,0,w*.41,.22);this.cyl(group,this.brass,0,h+.28,0,w*.44,.1);
      this.cyl(group,this.metal,0,h+.43,0,w*.34,.2);
      this.mesh(group, this.geom.oct, this.glow, [0, h + .93, 0], [.2, .42, .2]);
      for(let i=0;i<4;i++){const a=i*TAU/4;this.between(group,this.brass,[Math.cos(a)*.33,h+.48,Math.sin(a)*.33],[Math.cos(a)*.22,h+1.26,Math.sin(a)*.22],.025);}
      this.mesh(group,this.geom.cone,this.metal,[0,h+1.39,0],[.37,.34,.37]);
      this.cyl(group,this.brass,0,h+1.61,0,.05,.18);
      this.ivy(group,w*.23,2.8,d*.36,1.75,Math.round(o.x*103+o.z*31+1014));
      for(const side of [-1,1])this.between(group,this.stone,[side*w*.43,.42,0],[side*w*.21,1.2,0],w*.09,true);
    }
  }

  buildAtmosphere(state) {
    const random = rng(229), count = 160;
    const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { positions[i * 3] = (random() - .5) * 46; positions[i * 3 + 1] = .5 + random() * 9; positions[i * 3 + 2] = (random() - .5) * 46; color.set(i % 5 ? this.pal.glow : '#ffbe7d').multiplyScalar(.5 + random() * .6); colors.set([color.r, color.g, color.b], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: .12, map: this.moteTexture, transparent: true, opacity: .65, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.motes = new THREE.Points(geo, mat); this.scene.add(this.motes);
  }

  shadow(parent, size = .8) {
    return this.mesh(parent, this.geom.plane, this.contactMaterial, [0, .076, 0], [size*2.6, size*2.3, 1], [-Math.PI / 2, 0, 0]);
  }

  createHero(classId) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body); this.shadow(root, .68);
    const robe = this.material(classId === 'weaver' ? '#523b68' : classId === 'ranger' ? '#365347' : '#593842', .03, .97,0,this.fabricTexture);
    const cloth = this.material(classId === 'weaver' ? '#aea0bc' : '#a5a393', .03, .94,0,this.fabricTexture);
    const armor = this.material('#c8d2cd', .64, .52), gold = this.material('#e4c590', .68, .49), leather = this.material('#514034', .06, .94,0,this.fabricTexture), skin = this.material('#d4ac8b', 0, .8);
    this.painted(armor);this.painted(gold);
    const helmetArmor=this.painted(this.material('#889e9c',.6,.78));helmetArmor.roughness=.82;helmetArmor.envMapIntensity=.65;
    this.box(body, armor, 0, 1.25, 0, .64, .61, .4, true);
    this.box(body, gold, 0, .96, .015, .68, .09, .44, true);
    for(let i=0;i<3;i++){this.box(body,armor,0,1.1+i*.13,.235,.5-i*.06,.14,.08,true);this.box(body,gold,0,1.05+i*.13,.281,.48-i*.06,.018,.025);}
    for(const s of [-1,1]){
      const skirt=this.box(body,robe,s*.22,.76,0,.32,.44,.42,true);skirt.rotation.z=s*.1;
      this.box(body,gold,s*.22,.57,.23,.28,.025,.025);
      this.sphere(body,leather,s*.34,.98,-.07,.12,.16,.13);
      this.box(body,gold,s*.34,1.02,.07,.07,.055,.025);
    }
    this.box(body,leather,0,1.22,.277,.065,.55,.025).rotation.z=.48;
    this.mesh(body, this.geom.oct, this.glow, [0, 1.34, .23], [.12, .17, .045]);
    this.sphere(body, gold, 0, 1.59, 0, .17, .12, .17);
    this.sphere(body, skin, 0, 1.85, .055, .22, .25, .2);
    this.mesh(body,this.geom.helmet,helmetArmor,[0,1.94,-.025],[.255,.41,.235]);
    this.mesh(body,this.geom.cone,helmetArmor,[0,2.19,-.025],[.195,.16,.18]);
    this.box(body, this.edge, 0, 1.85, .217, .4, .11, .06, true);
    this.box(body, this.material('#86c8c1',.1,.4,1.2), 0, 1.86, .253, .25, .025, .012);
    this.box(body, gold, 0, 2.12, -.025, .035, .29, .3, true);
    this.box(body,gold,0,1.94,-.267,.027,.34,.025);
    this.box(body,helmetArmor,0,1.74,-.11,.4,.08,.38,true);
    for(const s of [-1,1]){
      this.box(body,armor,s*.18,1.79,.15,.08,.19,.09,true).rotation.z=s*.13;
      this.sphere(body,gold,s*.13,2.04,.16,.025);
      this.between(body,gold,[s*.19,1.85,.18],[s*.21,2.05,-.04],.015);
    }
    for (const side of [-1, 1]) {
      this.box(body,armor,side*.39,1.49,0,.39,.2,.42,true).rotation.z=-side*.2;
      this.box(body, gold, side * .41, 1.47, .18, .28, .065, .08, true);
      for(let i=0;i<3;i++){this.sphere(body,armor,side*(.4+i*.035),1.44-i*.06,-.015,.22-i*.025,.075,.245-i*.025);this.sphere(body,gold,side*(.4+i*.04),1.47-i*.06,.2-i*.02,.022);}
    }
    if (!this.capeGeometry) {
      this.capeGeometry = new THREE.PlaneGeometry(1.02, 1.42, 12, 16); const pos = this.capeGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); const t = (.71 - y) / 1.42; pos.setXYZ(i, pos.getX(i) * (.58 + t * .65), y+(t>.97?Math.sin(pos.getX(i)*23)*.035:0), -.08 - t * .4 + Math.cos(pos.getX(i) * 17) * .055 * t); }
      this.capeGeometry.computeVertexNormals(); this.ownedGeometries.add(this.capeGeometry);
    }
    if (!this.materials.has(`cape-${classId}`)) { const capeMat = robe.clone(); capeMat.side = THREE.DoubleSide; this.materials.set(`cape-${classId}`, capeMat); }
    const cape = this.mesh(body, this.capeGeometry, this.materials.get(`cape-${classId}`), [0, 1.02, -.22]);
    const collar=this.mesh(body,this.geom.torus,cloth,[0,1.57,-.03],[.32,.32,.18],[Math.PI/2,0,0]);
    for(const side of [-1,1])this.sphere(body,gold,side*.21,1.52,.2,.038);
    const emblem=this.mesh(body,this.geom.plane,this.sigilMaterial,[0,1.11,-.52],[.42,.42,1],[0,Math.PI,0]);emblem.castShadow=false;
    const legs = [], arms = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(side * .2, .94, 0); body.add(leg);
      this.box(leg, robe, 0, -.22, 0, .25, .45, .27, true); this.box(leg, armor, 0, -.49, .025, .24, .2, .3, true); this.box(leg, leather, 0, -.73, .07, .27, .3, .39, true); legs.push(leg);
      this.sphere(leg,armor,0,-.49,.16,.13,.15,.07);this.box(leg,gold,0,-.7,.23,.16,.025,.025);this.box(leg,armor,0,-.86,.14,.28,.1,.37,true);
      const arm = new THREE.Group(); arm.position.set(side * .42, 1.41, 0); body.add(arm);
      this.box(arm, robe, 0, -.21, 0, .2, .4, .23, true); this.box(arm, armor, 0, -.42, .015, .23, .23, .26, true); this.sphere(arm, leather, 0, -.59, .04, .13); arms.push(arm);
      for(const y of [-.35,-.48])this.cyl(arm,gold,0,y,.015,.13,.025);
    }
    if (classId === 'weaver') {
      this.cyl(arms[1], gold, 0, -.35, .18, .035, 1.7);
      this.mesh(arms[1], this.geom.oct, this.glow, [0, .62, .18], [.2, .35, .2]);
      this.mesh(arms[1], this.geom.torus, gold, [0, .57, .18], [.32, .32, .32]);
      for(let i=0;i<5;i++)this.mesh(arms[1],this.geom.torus,gold,[0,-.8+i*.27,.18],[.055,.055,.055],[Math.PI/2,0,0]);
    } else if (classId === 'ranger') {
      const bow = this.mesh(arms[1], this.geom.torus, gold, [0, -.24, .24], [.32, .64, .4]); bow.rotation.y = Math.PI / 2;
      this.box(arms[1], this.glow, 0, -.2, .24, .025, 1.05, .025);
      this.box(body, leather, .25, 1.2, -.35, .22, .65, .25, true);
    } else {
      this.box(arms[1], gold, 0, -.59, .21, .43, .07, .07, true);
      this.box(arms[1], leather, 0, -.59, .09, .065, .065, .25, true);
      this.mesh(arms[1], this.geom.oct, this.material('#b7eeeb', .5, .28, 1.4), [0, -.58, .76], [.09, .055, .67]);
      for(let i=0;i<4;i++)this.box(arms[1],gold,0,-.516,.44+i*.17,.025,.012,.035);
      this.box(arms[0], armor, -.1, -.27, .1, .17, .6, .48, true);
      this.box(arms[0], gold, -.19, -.27, .1, .035, .45, .055);
    }
    this.mesh(root, this.geom.ring, this.basic('#8feddb', .46, true), [0, .045, 0], [.75, 1, .75]);
    return { root, body, legs, arms, cape, type: 'player', classId };
  }

  createClaw(type = 'claw', elite = false, companion = false) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const shellColor = companion ? '#8bbbae' : type === 'caster' ? '#c799d0' : type === 'warden' ? '#d7b087' : elite ? '#edc38a' : '#e39172';
    const shell = this.material(shellColor, .55, .62), shellDark = this.material(companion ? '#456e67' : '#81514a', .55, .65), dark = this.material('#424d52', .62, .6), eye = this.material(companion ? '#caffd4' : '#e9ad65', 0, .4, companion?2.4:1.1);
    this.painted(shell);this.painted(shellDark);this.painted(dark);
    const legs = [], arms = [];
    this.shadow(root, .8);
    this.sphere(body, shellDark, 0, .55, -.08, .52, .29, .67);
    this.sphere(body, shell, 0, .71, -.06, .5, .3, .59);
    for(let i=0;i<5;i++){
      const zz=.35-i*.2,ww=.38+Math.sin(i/5*Math.PI)*.12;
      this.sphere(body,i%2?shell:shellDark,0,.77,zz,ww,.25,.14);
      for(const side of [-1,1])this.sphere(body,this.brass,side*ww*.79,.91,zz,.022);
    }
    this.box(body, this.brass, 0, 1.035, -.1, .025, .02, .7, true);
    for (let i = 0; i < 3; i++) this.sphere(body, shell, 0, .47 - i * .06, -.64 - i * .18, .31 - i * .05, .15, .2);
    for (const side of [-1, 1]) {
      this.cyl(body, dark, side * .21, .97, .4, .038, .24);
      this.sphere(body, eye, side * .21, 1.1, .42, companion?.105:.067, companion?.12:.078, companion?.105:.067);
      this.sphere(body, dark, side * .21, 1.11, companion?.51:.48, .03, .04, .018);
      this.between(body,dark,[side*.24,.89,.55],[side*.39,1.17,.83],.018);
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Group(); leg.position.set(side * .4, .53, .23 - i * .32); body.add(leg);
        this.box(leg, shellDark, side * .2, -.1, 0, .42, .1, .11, true).rotation.z = -side * .35;
        this.box(leg, dark, side * .4, -.3, 0, .1, .39, .1, true).rotation.z = side * .16;
        this.sphere(leg,this.brass,side*.37,-.18,0,.065);this.mesh(leg,this.geom.cone,dark,[side*.45,-.48,.07],[.065,.2,.065],[0,0,side*.4]);
        legs.push(leg);
      }
      const arm = new THREE.Group(); arm.position.set(side * .42, .65, .35); body.add(arm);
      this.box(arm, dark, side * .19, -.02, .24, .17, .14, .52, true).rotation.y = side * .45;
      this.sphere(arm, shell, side * .35, .035, .58, .27, .2, .32);
      this.sphere(arm, shell, side * .24, .05, .84, .13, .14, .25);
      this.sphere(arm, shell, side * .49, .05, .8, .1, .13, .21);
      this.sphere(arm,this.brass,side*.35,.23,.5,.055);this.box(arm,dark,side*.35,.21,.68,.025,.025,.33);
      for(let i=0;i<3;i++)this.mesh(arm,this.geom.cone,this.brass,[side*.32,.06,.88+i*.06],[.025,.08,.025],[0,0,Math.PI/2]);
      arms.push(arm);
    }
    if (type === 'warden') {
      this.box(body, this.metal, 0, .96, -.04, .72, .16, .76, true);
      for (const side of [-1, 1]) this.mesh(body, this.geom.cone, this.brass, [side * .34, 1.21, -.3], [.11, .4, .11]);
      root.scale.setScalar(1.28);
    }
    if (type === 'caster') {
      this.mesh(body, this.geom.torus, this.brass, [0, 1.38, -.17], [.55, .55, .55], [Math.PI / 2, 0, 0]);
      this.mesh(body, this.geom.oct, this.material('#d09eff', .2, .25, 4), [0, 1.6, -.17], [.18, .34, .18]);
    }
    if (companion) {
      root.scale.setScalar(.68);
      this.cyl(body, this.brass, 0, 1.37, -.3, .025, .9);
      this.mesh(body, this.geom.oct, this.warm, [0, 1.88, -.3], [.15, .21, .15]);
      this.mesh(root, this.geom.ring, this.basic('#8df4c6', .25, true), [0, .045, 0], [.85, 1, .85]);
    }
    if (elite) this.mesh(root, this.geom.ring, this.basic('#ffd38b', .38, true), [0, .05, 0], [1.1, 1, 1.1]);
    return { root, body, legs, arms, type, companion, elite };
  }

  createDrone(elite = false) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body); this.shadow(root, .6);
    const shell = this.material(elite ? '#d3a45e' : '#9e6956', .65, .33);
    this.sphere(body, shell, 0, 1.35, 0, .43, .35, .43);
    this.mesh(body, this.geom.torus, this.metal, [0, 1.35, 0], [.66, .66, .66], [Math.PI / 2, 0, 0]);
    this.box(body, this.edge, 0, 1.4, .38, .42, .14, .06, true);
    this.box(body, this.glow, 0, 1.41, .43, .26, .055, .035);
    for (const side of [-1, 1]) {
      this.box(body, this.metal, side * .56, 1.3, 0, .3, .14, .38, true);
      this.cyl(body, this.glow, side * .6, 1.15, 0, .1, .12);
      this.mesh(body, this.geom.cone, this.basic(this.pal.glow, .15, true), [side * .6, .92, 0], [.12, .45, .12], [Math.PI, 0, 0]);
    }
    return { root, body, legs: [], arms: [], type: 'drone' };
  }

  createBoss(chapter) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body); this.shadow(root, 2.35);
    const future = chapter >= 6;
    const shell = this.material(future ? '#b2afc4' : '#bf5a43', .68, .34), dark = this.material('#2b3548', .8, .3), trim = this.material('#cfab68', .78, .31), reactor = this.material(future ? '#d0acff' : '#7bffdb', .2, .2, 5);
    const legs = [], arms = [];
    this.sphere(body, dark, 0, 1.1, 0, 1.55, .67, 1.6);
    this.sphere(body, shell, 0, 1.5, -.28, 1.42, .72, 1.25);
    this.cyl(body, trim, 0, 1.98, .1, 1.08, .17);
    this.cyl(body, dark, 0, 2.1, .1, .94, .15);
    this.sphere(body, reactor, 0, 1.46, 1.28, .38, .3, .12);
    this.mesh(body, this.geom.torus, trim, [0, 1.46, 1.35], [.48, .48, .48]);
    for (let i = 0; i < 3; i++) this.box(body, shell, 0, 1.4 - i * .22, -1.1 - i * .36, 1.75 - i * .28, .4, .48, true);
    for (const side of [-1, 1]) {
      this.box(body, dark, side * 1.1, 2.1, -.72, .43, 1.2, .5, true);
      for (let j = 0; j < 4; j++) this.box(body, reactor, side * 1.1, 1.75 + j * .21, -.44, .28, .055, .04);
      this.cyl(body, trim, side * .8, 2.8, -.91, .055, 1.5);
      this.sphere(body, reactor, side * .8, 3.55, -.91, .11);
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Group(); leg.position.set(side * 1.1, 1.2, .7 - i * .75); body.add(leg);
        this.box(leg, shell, side * .45, -.23, -.1, 1.05, .24, .32, true).rotation.z = -side * .36;
        this.box(leg, dark, side * .94, -.68, -.1, .24, .9, .28, true).rotation.z = side * .17;
        this.box(leg, trim, side * 1.04, -1.08, -.03, .39, .15, .58, true); legs.push(leg);
      }
      const arm = new THREE.Group(); arm.position.set(side * 1.05, 1.44, .72); body.add(arm);
      this.sphere(arm, trim, side * .17, 0, .25, .33);
      this.box(arm, dark, side * .48, -.02, .52, .32, .29, .98, true).rotation.y = side * .7;
      this.sphere(arm, shell, side * .84, .1, 1.11, .64, .45, .68);
      this.sphere(arm, shell, side * .52, .12, 1.73, .24, .33, .65);
      this.sphere(arm, shell, side * 1.16, .12, 1.62, .25, .3, .5);
      this.box(arm, trim, side * .84, .54, 1.1, .12, .08, .68, true); arms.push(arm);
    }
    // The satirical founder is a stylized holographic pilot inside a mechanical throne.
    const suit = this.material(future ? '#b3a9dc' : '#617e92', .22, .45, .45), face = this.material('#c7e9e1', .1, .5, .65), hair = this.material(future ? '#605c74' : '#4b414a', .15, .7);
    this.box(body, dark, 0, 2.61, -.34, .9, 1.1, .22, true);
    this.box(body, suit, 0, 2.62, .05, .6, .66, .35, true);
    this.box(body, this.material('#e9e8d5', .2, .5, .35), 0, 2.75, .24, .2, .35, .04);
    this.sphere(body, face, 0, 3.19, .05, .23, .29, .22);
    this.sphere(body, hair, 0, 3.37, -.025, .25, .16, .24);
    for (const side of [-1, 1]) {
      this.box(body, suit, side * .34, 2.6, .13, .17, .48, .21, true).rotation.z = side * .22;
      this.sphere(body, face, side * .34, 2.41, .32, .1);
      this.box(body, dark, side * .61, 2.37, .19, .31, .21, .66, true);
      this.box(body, reactor, side * .61, 2.49, .3, .2, .035, .22);
    }
    if (!this.materials.has(`boss-dome-${future}`)) this.materials.set(`boss-dome-${future}`, new THREE.MeshPhysicalMaterial({ color: future ? '#bfaaff' : '#82e9d5', transparent: true, opacity: .075, roughness: .2, metalness: .1, depthWrite: false, side: THREE.DoubleSide }));
    const dome = this.materials.get(`boss-dome-${future}`);
    this.sphere(body, dome, 0, 2.8, .1, 1.04, 1.24, 1.04);
    this.mesh(root, this.geom.ring, this.basic(future ? '#d5b8ff' : '#ffad79', .45, true), [0, .045, 0], [2.55, 1, 2.55]);
    return { root, body, legs, arms, type: 'boss' };
  }

  syncActors(state, dt) {
    const all = [{ ...state.player, type: 'player' }, ...(state.enemies || []), ...(state.companion ? [{ ...state.companion, type: 'companion' }] : [])];
    const used = new Set();
    for (const a of all) {
      if (!Number.isFinite(a.x) || !Number.isFinite(a.z)) continue;
      used.add(a.id); let model = this.entities.get(a.id);
      if (model && model.type === 'player' && model.classId !== state.classId) { this.actorRoot.remove(model.root); this.entities.delete(a.id); model = null; }
      if (!model) {
        model = a.type === 'player' ? this.createHero(state.classId) : a.type === 'boss' ? this.createBoss(state.chapter) : a.type === 'drone' ? this.createDrone(a.elite) : this.createClaw(a.type, a.elite, a.type === 'companion');
        this.entities.set(a.id, model); this.actorRoot.add(model.root); model.root.rotation.y = a.angle || 0;
      }
      model.root.position.set(a.x, 0, a.z);
      const current = model.root.rotation.y, target = a.angle || 0, diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
      model.root.rotation.y += diff * Math.min(1, dt * 15);
      const stride = this.clock * (a.type === 'player' ? 11 : 12) + a.x * .25;
      model.body.position.y = a.moving ? Math.sin(stride * 2) * .045 : Math.sin(this.clock * 2.2 + a.z) * .022;
      const attacking = (a.attackTime || 0) > 0;
      for (let i = 0; i < model.legs.length; i++) model.legs[i].rotation.x = a.moving ? Math.sin(stride + i * (a.type === 'player' ? Math.PI : 1.8)) * (a.type === 'player' ? .55 : .25) : 0;
      for (let i = 0; i < model.arms.length; i++) {
        model.arms[i].rotation.x = attacking ? -Math.sin(clamp(a.attackTime * 8, 0, Math.PI)) * 1.1 : a.moving ? Math.sin(stride + i * Math.PI) * .15 : Math.sin(this.clock * 2 + i) * .045;
        model.arms[i].rotation.y = attacking && a.type !== 'player' ? Math.sin(this.clock * 22) * .22 : 0;
      }
      if (model.cape) model.cape.rotation.x = -.08 + (a.moving ? Math.sin(stride) * .09 - .12 : Math.sin(this.clock * 2.2) * .035);
      if (model.type === 'drone') { model.body.position.y = Math.sin(this.clock * 3.3 + a.x) * .16; model.body.rotation.z = Math.sin(this.clock * 2 + a.z) * .08; }
      if (a.type === 'player') { model.root.visible = !a.invulnerable || Math.floor(this.clock * 15) % 5 !== 0; this.heroLight.position.set(a.x+1.4,3.5,a.z+1.4); }
      if (a.hp <= 0) model.root.visible = false;
    }
    for (const [id, model] of this.entities) if (!used.has(id)) { this.actorRoot.remove(model.root); this.entities.delete(id); }
    const target = (state.enemies || []).find(a => a.id === state.selectedEnemy);
    this.selection.visible = !!target;
    if (target) { this.selection.position.set(target.x, .055, target.z); const s = target.type === 'boss' ? 2.7 : target.type === 'warden' ? 1.5 : 1.1; this.selection.scale.set(s, 1, s); }
  }

  createObject(o) {
    const root = new THREE.Group(); root.position.set(o.x, 0, o.z); const animated = [];
    let lid, light, ring, portalMaterial;
    const activeMat = this.material('#f5c47e', .5, .3, 2.2);
    if (o.type === 'chest') {
      this.shadow(root, .8);
      this.box(root, this.edge, 0, .16, 0, 1.23, .3, .92, true);
      this.box(root, this.material('#765340', .3, .62), 0, .45, 0, 1.15, .55, .85, true);
      for (const s of [-1, 1]) this.box(root, this.brass, s * .44, .46, .01, .1, .6, .91, true);
      lid = new THREE.Group(); lid.position.set(0, .75, -.42); root.add(lid);
      this.box(lid, this.metal, 0, .08, .42, 1.2, .24, .9, true);
      for (const s of [-1, 1]) this.box(lid, this.brass, s * .44, .12, .42, .1, .3, .92, true);
      this.box(lid, this.brass, 0, .08, .89, .22, .3, .08, true);
      light = this.box(root, activeMat, 0, .69, .43, .71, .035, .04);
      ring = this.mesh(root, this.geom.ring, this.basic('#e8c782', .27, true), [0, .045, 0], [1.02, 1, 1.02]);
    } else if (o.type === 'portal') {
      this.cyl(root, this.darkStone, 0, .14, 0, 2.3, .28);
      this.cyl(root, this.brass, 0, .3, 0, 2.12, .07);
      for (const s of [-1, 1]) { this.box(root, this.darkStone, s * 1.78, 1.75, 0, .48, 3.2, .75, true); this.box(root, this.brass, s * 1.78, 1.75, .4, .09, 2.6, .08); this.sphere(root, this.glow, s * 1.78, 3.6, 0, .18); }
      this.mesh(root, this.geom.torus, this.brass, [0, 2.24, 0], [2.05, 2.05, 2.05]);
      this.mesh(root, this.geom.torus, this.metal, [0, 2.24, -.1], [2.2, 2.2, 2.2]);
      ring = this.mesh(root, this.geom.torus, this.glow, [0, 2.24, .02], [1.87, 1.87, 1.87]);
      portalMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, tint: { value: new THREE.Color(this.pal.glow) }, strength: { value: 1 } },
        vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: `varying vec2 vUv;uniform float time;uniform float strength;uniform vec3 tint;void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);float sw=sin(a*5.-r*15.+time*1.5)*.5+.5;float waves=sin(r*40.-time*4.+sw*3.)*.5+.5;float edge=pow(r,5.);float alpha=(.17+edge*.7+waves*.15)*smoothstep(1.,.92,r)*strength;gl_FragColor=vec4(tint*(.5+edge*2.+sw*.4),alpha);}`,
        transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      });
      this.levelMaterials.add(portalMaterial);
      this.mesh(root, this.geom.disc, portalMaterial, [0, 2.24, .025], [1.85, 1.85, 1]);
      for (let i = 0; i < 12; i++) { const a = i * TAU / 12; const tile = this.box(root, this.brass, Math.cos(a) * 2.06, 2.24 + Math.sin(a) * 2.06, .1, .17, .28, .18, true); tile.rotation.z = a; }
    } else if (o.type === 'terminal') {
      this.box(root, this.darkStone, 0, .12, 0, 1.2, .24, 1, true);
      this.box(root, this.metal, 0, .76, 0, .74, 1.35, .55, true);
      const screen = this.box(root, this.edge, 0, 1.5, .08, 1.1, .7, .17, true); screen.rotation.x = -.22;
      light = this.box(root, this.glow, 0, 1.51, .19, .87, .49, .02); light.rotation.x = -.22;
      for (let i = 0; i < 4; i++) this.box(root, this.edge, -.14 + (i % 2) * .1, 1.36 + i * .1, .26, .45 + (i % 2) * .15, .018, .025);
      this.box(root, this.brass, 0, 1.05, .38, .95, .1, .34, true).rotation.x = .12;
      const shard = this.mesh(root, this.geom.oct, this.glow, [0, 2.2, 0], [.14, .25, .14]); animated.push(shard);
      ring = this.mesh(root, this.geom.ring, this.basic(this.pal.glow, .24, true), [0, .04, 0], [.9, 1, .9]);
    } else if (o.type === 'shrine') {
      this.cyl(root, this.darkStone, 0, .17, 0, .82, .34); this.cyl(root, this.brass, 0, .37, 0, .73, .08);
      this.mesh(root, this.geom.cone, this.stone, [0, .96, 0], [.6, 1.18, .6]);
      this.mesh(root, this.geom.torus, this.brass, [0, 1.65, 0], [.54, .54, .54]);
      light = this.mesh(root, this.geom.oct, this.material('#baf1be', .2, .4, 4.3), [0, 1.6, 0], [.23, .46, .23]); animated.push(light);
      ring = this.mesh(root, this.geom.ring, this.basic('#b2e6ad', .35, true), [0, .05, 0], [1.15, 1, 1.15]);
    } else {
      this.cyl(root, this.darkStone, 0, .1, 0, .53, .2);
      this.box(root, this.metal, 0, .58, 0, .36, .8, .4, true);
      this.box(root, this.brass, 0, 1.03, .03, .8, .08, .6, true).rotation.x = .2;
      this.box(root, this.material('#d9c6a2', .05, .9), 0, 1.11, .05, .64, .05, .47).rotation.x = .2;
      light = this.mesh(root, this.geom.oct, this.warm, [0, 1.7, .05], [.12, .2, .12]); animated.push(light);
      ring = this.mesh(root, this.geom.ring, this.basic('#edd49e', .24, true), [0, .035, 0], [.75, 1, .75]);
    }
    this.actorRoot.add(root);
    return { root, animated, lid, light, ring, portalMaterial, type: o.type };
  }

  syncObjects(state, dt) {
    const used = new Set();
    for (const o of state.objects || []) {
      used.add(o.id); let m = this.objectModels.get(o.id); if (!m) { m = this.createObject(o); this.objectModels.set(o.id, m); }
      const active = !!o.active;
      if (m.lid) m.lid.rotation.x = THREE.MathUtils.lerp(m.lid.rotation.x, active ? 0 : -1.2, Math.min(1, dt * 5));
      if (m.light) { m.light.visible = active; }
      if (m.ring) m.ring.visible = active;
      for (const a of m.animated) { a.rotation.y = this.clock * .8; a.position.y += Math.sin(this.clock * 2 + o.x) * dt * .065; }
      if (m.portalMaterial) { m.portalMaterial.uniforms.time.value = this.clock; m.portalMaterial.uniforms.strength.value = active ? 1 : .1; }
    }
    for (const [id, m] of this.objectModels) if (!used.has(id)) { this.actorRoot.remove(m.root); this.objectModels.delete(id); }
  }

  syncDrops(state) {
    const used = new Set();
    for (const d of state.drops || []) {
      used.add(d.id); let m = this.dropModels.get(d.id);
      if (!m) {
        const root = new THREE.Group(); const c = d.item?.color || '#a9d5bd';
        const gem = this.mesh(root, this.geom.oct, this.material(c, .45, .3, 1.7), [0, .4, 0], [.16, .27, .16]);
        this.mesh(root, this.geom.ring, this.basic(c, .4, true), [0, .045, 0], [.4, 1, .4]);
        if (d.item?.rarity !== 'common') this.mesh(root, this.geom.cylinder, this.basic(c, .065, true), [0, 1, 0], [.07, 2, .07]);
        m = { root, gem }; this.dropModels.set(d.id, m); this.actorRoot.add(root);
      }
      m.root.position.set(d.x, 0, d.z); m.gem.position.y = .42 + Math.sin(this.clock * 3 + d.x) * .09; m.gem.rotation.y = this.clock * 1.2;
    }
    for (const [id, m] of this.dropModels) if (!used.has(id)) { this.actorRoot.remove(m.root); this.dropModels.delete(id); }
  }

  createEffect(e) {
    const group = new THREE.Group(), material = new THREE.MeshBasicMaterial({ color: e.color || (e.type === 'heal' ? '#aaffc9' : e.type === 'telegraph' ? '#ff6259' : '#9ffff0'), transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const parts = [], random = rng(String(e.id).split('').reduce((a, c) => a + c.charCodeAt(0), 3));
    if (e.type === 'nova' || e.type === 'telegraph' || e.type === 'heal') {
      parts.push(this.mesh(group, this.geom.ring, material, [0, .09, 0]));
      if (e.type !== 'telegraph') for (let i = 0; i < 12; i++) { const p = this.mesh(group, this.geom.oct, material, [0, .2, 0], [.06, .22, .06]); p.userData.angle = i * TAU / 12; parts.push(p); }
    } else if (e.type === 'slash') {
      parts.push(this.mesh(group, this.geom.slash, material, [0, .7, 0], [1.25, 1.25, 1.25], [Math.PI / 2, 0, 0]));
    } else if (e.type === 'bolt') {
      parts.push(this.sphere(group, material, 0, .9, 0, .18));
      parts.push(this.mesh(group, this.geom.oct, material, [0, .9, -.28], [.1, .1, .5]));
    } else {
      const count = e.type === 'dash' ? 8 : 10;
      for (let i = 0; i < count; i++) { const p = this.mesh(group, this.geom.oct, material, [0, .6, 0], [.045 + random() * .06, .11, .045]); p.userData.velocity = new THREE.Vector3((random() - .5) * 3.2, .6 + random() * 2.4, (random() - .5) * 3.2); parts.push(p); }
    }
    this.fxRoot.add(group); return { group, parts, material };
  }

  syncEffects(state) {
    const used = new Set();
    for (const e of state.effects || []) {
      if (state.settings?.particles === false && e.type !== 'telegraph') continue;
      used.add(e.id); let m = this.effectModels.get(e.id); if (!m) { m = this.createEffect(e); this.effectModels.set(e.id, m); }
      const progress = clamp((e.age || 0) / (e.duration || .5), 0, 1);
      m.group.position.set(e.x, 0, e.z); m.material.opacity = (1 - progress) * .85;
      if (e.type === 'nova' || e.type === 'telegraph' || e.type === 'heal') {
        const r = e.type === 'telegraph' ? (e.radius || 3.6) : e.type === 'nova' ? .5 + progress * (e.radius || 5.5) : .6 + progress * 1.1;
        m.parts[0].scale.set(r, 1, r);
        if (e.type === 'telegraph') m.material.opacity = .2 + Math.sin(this.clock * 15) * .12 + progress * .35;
        for (let i = 1; i < m.parts.length; i++) { const a = m.parts[i].userData.angle; m.parts[i].position.set(Math.sin(a) * r, .2 + Math.sin(progress * Math.PI) * (e.type === 'heal' ? 2 : .7), Math.cos(a) * r); }
      } else if (e.type === 'slash') {
        m.group.rotation.y = Math.atan2((e.tx ?? e.x) - e.x, (e.tz ?? e.z + 1) - e.z) + progress * 1.8;
        m.group.scale.setScalar(.7 + progress * .8);
      } else if (e.type === 'bolt') {
        m.group.position.set(THREE.MathUtils.lerp(e.x, e.tx ?? e.x, progress), 0, THREE.MathUtils.lerp(e.z, e.tz ?? e.z, progress));
        m.group.rotation.y = Math.atan2((e.tx ?? e.x) - e.x, (e.tz ?? e.z) - e.z);
      } else {
        for (const p of m.parts) { const vel = p.userData.velocity; p.position.set(vel.x * progress, .5 + vel.y * progress - progress * progress, vel.z * progress); p.rotation.x = progress * 5; p.rotation.z = progress * 3; }
      }
    }
    for (const [id, m] of this.effectModels) if (!used.has(id)) { this.fxRoot.remove(m.group); m.material.dispose(); this.effectModels.delete(id); }
    // Telegraph effects use the game-provided impact position and radius. They
    // are deliberately kept when the cosmetic-particle setting is disabled.
  }

  render(state, dt = .016) {
    if (!state?.player) return;
    dt = Math.min(.06, Math.max(0, dt)); this.clock += dt;
    this.syncActors(state, dt); this.syncObjects(state, dt); this.syncDrops(state, dt); this.syncEffects(state);
    this.zoom = THREE.MathUtils.lerp(this.zoom, this.targetZoom, Math.min(1, dt * 8)); this.updateCameraBounds();
    const focusX = state.player.x, focusZ = state.player.z - 1.6;
    this.cameraTarget.x = THREE.MathUtils.lerp(this.cameraTarget.x, focusX, Math.min(1, dt * 4));
    this.cameraTarget.z = THREE.MathUtils.lerp(this.cameraTarget.z, focusZ, Math.min(1, dt * 4));
    this.camera.position.copy(this.cameraTarget).add(this.cameraOffset);
    if (state.settings?.shake && state.player.attackTime > 0 && state.player.attackTime < .09) { this.camera.position.x += Math.sin(this.clock * 83) * .025; this.camera.position.z += Math.cos(this.clock * 71) * .025; }
    this.camera.lookAt(this.cameraTarget);
    this.key.position.set(this.cameraTarget.x - 12, 28, this.cameraTarget.z + 16); this.key.target.position.copy(this.cameraTarget);
    const lamps=[...this.lanternPositions].sort((a,b)=>a.distanceToSquared(this.cameraTarget)-b.distanceToSquared(this.cameraTarget));
    for(let i=0;i<this.lampLights.length;i++){const light=this.lampLights[i],position=lamps[i];light.visible=!!position;if(position){light.position.copy(position);light.intensity=15+Math.sin(this.clock*7.1+i*2)*.9+Math.sin(this.clock*13+i)*.4;}}
    if (this.motes) { this.motes.visible = state.settings?.particles !== false; this.motes.rotation.y = Math.sin(this.clock * .015) * .04; this.motes.position.y = Math.sin(this.clock * .1) * .28; }
    this.postMaterial.uniforms.time.value = this.clock;
    this.renderer.setRenderTarget(this.sceneTarget); this.renderer.render(this.scene, this.camera);
    this.quad.material = this.blurMaterial;
    this.blurMaterial.uniforms.source.value = this.sceneTarget.texture; this.blurMaterial.uniforms.threshold.value = 1.2;
    this.blurMaterial.uniforms.stepUV.value.set(1.7 / this.bloomA.width, 0);
    this.renderer.setRenderTarget(this.bloomA); this.renderer.render(this.postScene, this.postCamera);
    this.blurMaterial.uniforms.source.value = this.bloomA.texture; this.blurMaterial.uniforms.threshold.value = 0;
    this.blurMaterial.uniforms.stepUV.value.set(0, 1.7 / this.bloomA.height);
    this.renderer.setRenderTarget(this.bloomB); this.renderer.render(this.postScene, this.postCamera);
    this.quad.material = this.postMaterial; this.renderer.setRenderTarget(null); this.renderer.render(this.postScene, this.postCamera);
  }

  dispose() {
    this.disposed=true;
    this.resizeObserver?.disconnect();
    for (const material of this.materials.values()) material.dispose();
    for (const material of this.levelMaterials) material.dispose();
    for (const geometry of this.levelGeometries) geometry.dispose();
    for (const geometry of this.ownedGeometries) geometry.dispose();
    for (const texture of this.textures) texture.dispose();
    for (const effect of this.effectModels.values()) effect.material.dispose();
    this.motes?.geometry.dispose(); this.motes?.material.dispose();
    this.environmentTarget?.dispose();this.sceneTarget.depthTexture?.dispose();this.sceneTarget.dispose(); this.bloomA.dispose(); this.bloomB.dispose(); this.blurMaterial.dispose(); this.postMaterial.dispose(); this.quad.geometry.dispose(); this.renderer.dispose();
  }
}
