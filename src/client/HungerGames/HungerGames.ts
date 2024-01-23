import { ISContextMenu, ISDebugMenu, ISModalDialog, getPlayer, isClient, sendClientCommand } from "@asledgehammer/pipewrench"
import * as Events from '@asledgehammer/pipewrench-events';









Events.onServerCommand.addListener((module, command, args) => {
    if (module != "HungerGames") return
    if (!isClient()) return
    if (command == "pong") {
        if (args.command == "register") {
            print(args.res);
        }
    }
})


Events.onAddMessage.addListener((chatMessage, tab) => {
    if (isClient()) {
        if (chatMessage.getText() == "!hg join") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "register"})
        }
        if (chatMessage.getText() == "!hg create") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "create"})
        }
        if (chatMessage.getText() == "!hg start") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "start"})
        }
        if (chatMessage.getText() == "!hg menu") {
            openMenu();
        }
    }
  })


const openMenu = () => {
    
    const debugMenu = new ISContextMenu(0, 0, 100, 100, 100);
    debugMenu.mainButton = "Join Game";
    debugMenu.setUIName("Hunger Games");
    
    debugMenu.addToUIManager();
}