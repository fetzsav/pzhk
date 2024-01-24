/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

// PipeWrench API.
import * as Events from '@asledgehammer/pipewrench-events';
import { ISBarbedWire, ISBuildingObject, IsoPlayer, IsoThumpable, ItemContainer, getCell, getWorld, isServer, sendServerCommand} from "@asledgehammer/pipewrench"
import { HungerGameMatch, HungerGameState } from './api/HungerGamesAPI';
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
      if (args.command == "create") {
          createMatch();
          print(state.matches.length);
      }
      if (args.command == "build") {
        createWall(args.x, args.y, args.z, "fencing_01_92")
    }
    if (args.command == "jail") {
        jailPlayer(player)
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

const createWall = (x: any, y: any, z: any, wallname: string) => {
    const cell = getWorld().getCell();
    const square = cell.getGridSquare(x, y, z);
    const wall = new IsoThumpable(cell, square, wallname,  false, {})
    wall.setName("Wall");
    wall.setIsThumpable(false);
    square.AddSpecialObject(wall);
    wall.transmitCompleteItemToClients();
}

const jailPlayer = (player: IsoPlayer) => {
    const playerX = player.getX();
    const playerY = player.getY();
    const playerZ = player.getZ();
    //top corner
    createWall(playerX, playerY, playerZ, "fencing_01_92");
    //bottom right corner
    createWall(playerX+1, playerY, playerZ, "fencing_01_90");
    //bottom left corner
    createWall(playerX, playerY+1, playerZ, "fencing_01_89");
}


//fencing_01_92 - top corner
//fencing_01_90 - top / bottom
//fencing_01_89 - bottom corner