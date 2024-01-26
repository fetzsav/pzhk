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
        if (chatMessage.getText().includes("!hg create")) {
            const height = chatMessage.getText().split(" ")[2];
            const width = chatMessage.getText().split(" ")[3];
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "create", "height": height, "width": width })
        }
        if (chatMessage.getText() == "!hg clean") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "clean"})
        }
        if (chatMessage.getText() == "!hg start") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "start"})
        }
        
        if (chatMessage.getText() == "!hg menu") {
            openMenu();
        }
        if (chatMessage.getText() == "!jail") {
            const player = getPlayer();
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "jail", "player": player})
        }
    }
  })


const openMenu = () => {
    const modal = new ISModalDialog(0, 0, 100, 100, "Hunger Games", true, "", "", null, "Hunger Games", "");
    modal.addScrollBars();
    modal.addToUIManager();
}