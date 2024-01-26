/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

// PipeWrench API.
import * as Events from '@asledgehammer/pipewrench-events';
import { ISBarbedWire, ISBuildingObject, IsoPlayer, IsoThumpable, ItemContainer, getCell, getOnlinePlayers, getWorld, isServer, sendServerCommand} from "@asledgehammer/pipewrench"
import { HungerGameMatch, HungerGameState } from './api/HungerGamesAPI';
import { createArena, cleanArena, jailPlayer } from './api/HungerGamesAPI';
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
      if (args.command == "register") {
          registerForGame(player);
      }
    //   if (args.command == "create") {
    //       createMatch();
    //       print(state.matches.length);
    //   }
    if (args.command == "create") {
        print("Creating arena")
        const x = player.getX();
        const y = player.getY();
        const z = player.getZ();
        createArena(Math.round(x), Math.round(y), Math.round(z), args.height, args.width);
    }
    if (args.command == "clean") {
        cleanArena(player);
    }
    if (args.command == "jail") {
        jailPlayer(player.getUsername())
    }
  }
})


const registerForGame = (player: IsoPlayer) => {
  if (state.matches.length < 1) {
      //create new match (todo)
      sendServerCommand(player, "HungerGames", "pong", {"command": "register", "res": "No Matches"})
  }
  //iterate through matches and find one with space
  for (let i = 0; i < state.matches.length; i++) {
      if (state.matches[i].players.length <= state.matches[i].maxPlayers && state.matches[i].started == false && state.matches[i].matchmaking == true) {
          //join match
          sendServerCommand(player, "HungerGames", "pong", {"command": "register", "res": "Joined Match"})
          return;
      }
  }
}

const createMatch = () => {
  const match: HungerGameMatch = {
      players: [],
      remainingPlayers: 0,
      maxPlayers: 8,
      started: false,
      matchmaking: true,
      inventories: new Map<IsoPlayer, ItemContainer>(),
  };
  state.matches.push(match);
}

//fencing_01_92 - top corner
//fencing_01_90 - top / bottom
//fencing_01_89 - bottom corner