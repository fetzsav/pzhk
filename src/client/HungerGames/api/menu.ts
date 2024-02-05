/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */


import { ISCollapsableWindow, ISPanel, ISRichTextPanel, ISScrollingListBox} from "@asledgehammer/pipewrench";
// import { arenaList } from "../HungerGames";

export const createWindow = () => {
    const window = new ISCollapsableWindow(0, 0, 300, 300);
    window.title = "Hunger Games";
    window.initialise();
    hydrateWindow(window);
    window.addToUIManager();
}

const hydrateWindow = (window: ISCollapsableWindow) => {
    // creating the panel
    const panel: ISPanel = new ISPanel(0, window.titleBarHeight(), window.getWidth(), window.getHeight() - (window.titleBarHeight() + window.resizeWidgetHeight()));
    panel.initialise();

    //adding title to panel
    addTitleText(panel);

    //adding arena list to panel
    // addArenaList(panel);

    //adding panel to window
    window.addChild(panel);
}

const addTitleText = (panel: ISPanel) => {
    const text: ISRichTextPanel = new ISRichTextPanel(0, 0, panel.getWidth(), panel.getHeight());
    text.initialise();
    text.text = "Welcome to the Hunger Games! <LINE>";
    text.autosetheight = false;
    text.clip = true;
    text.ignoreHeightChange = true;
    text.addScrollBars();
    text.paginate();
    panel.addChild(text);
}

// const addArenaList = (panel: ISPanel) => {
//     const list = new ISScrollingListBox(0, 0, panel.getWidth(), panel.getHeight());
//     arenaList.forEach(arena => {
//         list.addItem("Arena");
//     });
//     panel.addChild(list);
// }
