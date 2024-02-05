/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

import { ISModalDialog, getFileWriter, getPlayer, isClient, sendClientCommand } from "@asledgehammer/pipewrench"
import * as Events from '@asledgehammer/pipewrench-events';
import { createWindow } from "./api/menu";

import * as dkjson from "dkjson";


interface ArenaConfig {
    center: Coordinates;
    height: number;
    width: number;
    loot: Loot[];
  }

  interface Coordinates {
    x: number;
    y: number;
    z: number;

}

interface Loot {
    type: LootType[];
    location: Coordinates;
    size: ContainerSize;
}
enum LootType {
    Food,
    Weapons,
    Medical,
    Other
}

enum ContainerSize {
    Small,
    Medium,
    Large
}


 const arenaList: ArenaConfig[] = [];


Events.onServerCommand.addListener((module, command, args) => {
    if (module != "HungerGames") return
    if (!isClient()) return
    if (command == "pong") {
        if (args.command == "register") {
            print(args.res);
        }
    }
})

Events.onServerCommand.addListener((module, command, args) => {
    if (module != "HungerGames") return
    if (!isClient()) return
    if (command == "pong") {
        if (args.command == "arenalist") {
            const arenaString = args.res;
            print(arenaString);
            
            // arenaList = dkjson.decode(arenaString);
        }
    }
});


Events.onAddMessage.addListener((chatMessage, tab) => {
    if (isClient()) {
        if (chatMessage.getText() == "!hg join") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "register"})
        }
        if (chatMessage.getText().includes("!hg create")) {
            const name = chatMessage.getText().split(" ")[2];
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "create", "name": name})
        }
        if (chatMessage.getText() == "!hg clean") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "clean"})
        }
        if (chatMessage.getText() == "!hg start") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "start"})
        }
        
        if (chatMessage.getText() == "!hg menu") {
            createWindow();
        }
        if (chatMessage.getText() == "!jail") {
            const player = getPlayer();
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "jail", "player": player})
        }
        if (chatMessage.getText() == "!container") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "container"})
        }
        if (chatMessage.getText() == "!coords") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "coords"})
        }
        if (chatMessage.getText() == "!arenas") {
            sendClientCommand(getPlayer(), "HungerGames", "ping", {"command": "arenas"})
            // saveArena();
        }
        
    }
  })


const openMenu = () => {
    const modal = new ISModalDialog(0, 0, 100, 100, "Hunger Games", true, "", "", null, "Hunger Games", "");
    modal.addScrollBars();
    modal.addToUIManager();
}

export const saveArena = () => {
    const fname = "arena1.json";
    const fileWriter = getFileWriter(fname, true, false);
    fileWriter.write("arena test");
    fileWriter.close();
  }