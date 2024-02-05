
/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

import { IsoPlayer, ItemContainer, getOnlinePlayers,} from "@asledgehammer/pipewrench";
import { createWall } from "./Arena";

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


