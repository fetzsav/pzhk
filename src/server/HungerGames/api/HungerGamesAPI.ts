
// /**
//  * @noSelfInFile
//  *
//  * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
//  *       from prepending a 'self' reference, which is usually not necessary and complicates
//  *       rendered Lua code.
//  */

import { IsoPlayer, IsoThumpable, ItemContainer, getOnlinePlayers, getWorld, isServer } from "@asledgehammer/pipewrench";

// import { InventoryContainer, IsoPlayer, ItemContainer, getConnectedPlayers, isClient, isServer, sendServerCommand, triggerEvent } from "@asledgehammer/pipewrench";
// import { onClientCommand } from "@asledgehammer/pipewrench-events";


export interface HungerGameState {
    matches: HungerGameMatch[];
    queue: IsoPlayer[];
}

export interface HungerGameMatch {
    players: HungerGamePlayer[];
    remainingPlayers: number;
    maxPlayers: number;
    started: boolean;
    matchmaking: boolean;
    inventories: Map<IsoPlayer, ItemContainer>;
}


interface HungerGamePlayer {
    isoPlayer: IsoPlayer;
    kills: number;
    deaths: number;
    isAlive: boolean;
    isInGame: boolean;
}


// export function enableHungerGames() {
//     const game: HungerGame = {
//         players: [],
//         remainingPlayers: 0,
//         maxPlayers: 8,
//         started: false,
//         matchmaking: false,
//         inventories: new Map<IsoPlayer, ItemContainer>(),
//     };
    
//     if (!game.started) {
//         return;
//     }

// }

// export function startMatchMaking(game: HungerGame) {
//     game.matchmaking = true;
//     print("Hunger Games matchmaking started. Please use the /hg join command to join the game.");
//     addHandleJoinListener(game);
// }

// export function addHandleJoinListener(game: HungerGame) {
//     onClientCommand.addListener((module, command, player, args) => {
//         if (isClient()) return; // dont execute on clients
//         // if (module != "zombiehk") return
//         if (command == "hg join") {
//             if (isServer()) {
//                 print("Server received hg join from " + player.getName());
//                 const hgplayer: HungerGamePlayer = {
//                     isoPlayer: player,
//                     kills: 0,
//                     deaths: 0,
//                     isAlive: true,
//                     isInGame: false,
//                 };
//                 game.players.push(hgplayer);
//                 game.remainingPlayers++;
//             }
//             else {
//             // print("Server received hg join from " + player.getName());
//             // // send hack for single-player
//             }
//         }
//       })
// }


// export function startGame(game: HungerGame) {
//     for (let index = 0; index < game.players.length; index++) {
//         const hgplayer: HungerGamePlayer = game.players[index];
//         if (!hgplayer.isInGame) {
//             // save inventory
//             game.inventories.set(hgplayer.isoPlayer, hgplayer.isoPlayer.getInventory());
//             //clear inventory
//             hgplayer.isoPlayer.getInventory().clear();
            
//         }
//     }
// }


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

  export const jailPlayer = (username: string) => {
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


  export const createArena = (x: number, y: number, z: number, height_x: number, width_y: number) => {
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

  export const cleanArena = (player: IsoPlayer) => {
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