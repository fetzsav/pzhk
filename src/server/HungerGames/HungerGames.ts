/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

// PipeWrench API.
import * as Events from '@asledgehammer/pipewrench-events';
import { IsoPlayer, isServer, sendServerCommand} from "@asledgehammer/pipewrench"
import { HungerGameState } from './api/HungerGamesAPI';
import { jailPlayer } from './api/HungerGamesAPI';
import { Coordinates, spawnContainer } from './api/Loot';
import { ArenaConfig, cleanArena, createArena, loadArena, saveArena } from './api/Arena';
import * as dkjson from "dkjson";

// Example reference API.


const state: HungerGameState = {
    matches: [],
    queue: []
}


// Events.onGameStart.addListener(() => {
    
// });


Events.onClientCommand.addListener((module, command, player, args) => {
  if (module != "HungerGames") return
  if (!isServer()) return
  
  //Catch client commands here
  if (command == "ping") {
    //   if (args.command == "create") {
    //       createMatch();
    //       print(state.matches.length);
    //   }
    if (args.command == "create") {
        print("Creating arena")
        const x = player.getX();
        const y = player.getY();
        const z = player.getZ();
        // createArena(Math.round(x), Math.round(y), Math.round(z), args.height, args.width);
    }
    if (args.command == "clean") {
        cleanArena(player);
    }
    if (args.command == "jail") {
        jailPlayer(player.getUsername())
    }
    if (args.command == "container") {
        const location: Coordinates = {
            x: player.getX(),
            y: player.getY(),
            z: player.getZ()
        }
        spawnContainer("carpentry_01_18", location, ["HCMakeshiftaxe", "HCBattleaxeiron"]);
    }
    if (args.command == "coords") {
        getCoords(player)
    }
    if (args.command == "create") {
        createArena(args.name);
    }
    if (args.command == "write") {
        const ArenaCenter: Coordinates = {
            x: 7221,
            y: 5532,
            z: 0
          }
          const ArenaHeight = 30;
          const ArenaWidth = 30;
        const arena1: ArenaConfig = {
            center: ArenaCenter,
            height: ArenaHeight,
            width: ArenaWidth,
            loot: []
          }
          print("Arena: ", arena1, arena1.center.x);
        saveArena(arena1, "arena1");
        print("Arena saved");
    }

    if (args.command == "load") {
        print("loading arena")
        const arena = loadArena("arena1");
        print("Arena loaded: ", arena);
    }
    if (args.command == "arenas") {
        const arenas = getArenas();
        const arenaString = dkjson.encode(arenas);
        print("arena list: ", arenaString);
        sendServerCommand(player, "HungerGames", "pong", {"command": "arenalist", "res": arenaString});
    }
  }
})

const getArenas = (): ArenaConfig[] => {
    const arenas: ArenaConfig[] = [];
    let x = 1;
    let done = false;
    while (done == false) {
        const arena_name = "arena"+x.toString();
        print("Loading arena: ", arena_name);
        const arena = loadArena(arena_name);
        if (arena == null) {
            done = true;
            break;
        }
        arenas.push(arena);
        x++;
    }
    return arenas;
}

const getCoords = (player: IsoPlayer) => {
    const x = player.getX();
    const y = player.getY();
    const z = player.getZ();
    print(`X: ${x}, Y: ${y}, Z: ${z}`)
}


//fencing_01_92 - top corner
//fencing_01_90 - top / bottom
//fencing_01_89 - bottom corner