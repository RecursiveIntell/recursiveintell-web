export const REPLACE_CAMPAIGN_MESSAGE='Start a new campaign? This will replace your existing saved campaign. To keep it, choose Cancel, continue your campaign, and export it from Settings first.';

// Keep the decision ahead of audio, game state, storage, and UI side effects.
export function startCampaign({game,sound,ui,confirmOverwrite},classId,difficulty){
 if(game.hasSave()&&!confirmOverwrite(REPLACE_CAMPAIGN_MESSAGE))return false;
 sound.start();
 game.start(classId,difficulty);
 sound.configure(game.state.settings);
 ui.update(game.state);
 return true;
}
