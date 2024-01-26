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
      if (args.command == "build") {
        createWall(args.x, args.y, args.z, "fencing_01_92")
    }
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

const createWall = (x: any, y: any, z: any, wallname: string) => {
    if(!isServer()) return;
    const cell = getWorld().getCell();
    const square = cell.getGridSquare(x, y, z);
    const wall = new IsoThumpable(cell, square, wallname,  false, {})
    const wall_name = "arena";
    wall.setName(wall_name);
    wall.setIsThumpable(false);
    square.AddSpecialObject(wall);
    wall.transmitCompleteItemToClients();
  }

  const jailPlayer = (username: string) => {
    const users = getOnlinePlayers();
    for (let i = 0; i < users.size(); i++) {
      const user = users.get(i);
      if (user.getUsername() == username) {
        createJail(user);
      }
    }
  }

  const createJail = (player: IsoPlayer) => {
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


  const createArena = (x: number, y: number, z: number, height_x: number, width_y: number) => {
    const xOffset = height_x / 2;
    const yOffset = width_y / 2;
    print("Create arena called", "x: ", x, "y: ", y, "z: ", z, "height_x: ", height_x, "width_y: ", width_y);


    //CREATING LR WALLS
    const bottom_left_starting_point_x = x - xOffset;
    const bottom_left_ending_point_x = x + xOffset;
    const bottom_left_starting_point_y = y - yOffset;
    const bottom_left_ending_point_y = y + yOffset;
    print("bottom_left_starting_point_x: ", bottom_left_starting_point_x);

    //right
    for (let x = bottom_left_starting_point_x+1; x < bottom_left_ending_point_x; x++) {
        createWall(x, y-(yOffset), z, "fencing_01_89");
    }


    //left
    for (let x = bottom_left_starting_point_x; x < bottom_left_ending_point_x; x++) {
        createWall(x, y+(yOffset), z, "fencing_01_89");
    }

    //top
    for (let y = bottom_left_starting_point_y; y < bottom_left_ending_point_y; y++) {
        if (y == bottom_left_starting_point_y) {
            createWall(x-(xOffset), y, z, "fencing_01_92");
        }
        createWall(x-(xOffset), y, z, "fencing_01_90");
    }

    //bottom
    for (let y = bottom_left_starting_point_y; y < bottom_left_ending_point_y; y++) {
        createWall(x+(xOffset), y, z, "fencing_01_90");
    }
  }

  const cleanArena = (player: IsoPlayer) => {
    const cell = player.getCell();
    const objectList = cell.getProcessIsoObjects();
    for (let i = 0; i < objectList.size(); i++) {
      const obj = objectList.get(i);
      if (obj.getName() == "arena") {
        const square = cell.getGridSquare(obj.getX(), obj.getY(), obj.getZ());
        square.transmitRemoveItemFromSquareOnServer(obj);
        square.transmitRemoveItemFromSquare(obj);
        obj.removeFromWorld();
        obj.removeFromSquare();
        square.transmitRemoveItemFromSquareOnServer(obj);
        square.transmitRemoveItemFromSquare(obj);
      }
    }  
  }

//fencing_01_92 - top corner
//fencing_01_90 - top / bottom
//fencing_01_89 - bottom corner