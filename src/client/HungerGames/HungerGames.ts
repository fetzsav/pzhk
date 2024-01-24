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
        if (chatMessage.getText() == "!hg build") {
            const players = getPlayer();
            const x = players.getX();
            const y = players.getY();
            const z = players.getZ();
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "build", "x": x, "y": y, "z": z})
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