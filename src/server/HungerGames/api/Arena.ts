/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */


import { IsoPlayer, IsoThumpable, getFileReader, getFileWriter, getWorld, isServer } from "@asledgehammer/pipewrench";
import { Coordinates, Loot, spawnAllLoot } from "./Loot";
import * as dkjson from "dkjson";

export const buildArenaWalls = (arena: ArenaConfig) => {
    const xOffset = arena.height / 2;
    const yOffset = arena.width / 2;
    print("Create arena called", "x: ", arena.center.x, "y: ", arena.center.y, "z: ", arena.center.z, "height_x: ", arena.height, "width_y: ", arena.width);


    //CREATING LR WALLS
    const bottom_left_starting_point_x = arena.center.x - xOffset;
    const bottom_left_ending_point_x = arena.center.x + xOffset;
    const bottom_left_starting_point_y = arena.center.y - yOffset;
    const bottom_left_ending_point_y = arena.center.y + yOffset;
    print("bottom_left_starting_point_x: ", bottom_left_starting_point_x);

    //right
    for (let x = bottom_left_starting_point_x+1; x < bottom_left_ending_point_x; x++) {
        createWall(x, arena.center.y-(yOffset), arena.center.z, "fencing_01_89");
    }


    //left
    for (let x = bottom_left_starting_point_x; x < bottom_left_ending_point_x; x++) {
        createWall(x, arena.center.y+(yOffset), arena.center.z, "fencing_01_89");
    }

    //top
    for (let y = bottom_left_starting_point_y; y < bottom_left_ending_point_y; y++) {
        if (y == bottom_left_starting_point_y) {
            createWall(arena.center.x-(xOffset), y, arena.center.z, "fencing_01_92");
        }
        createWall(arena.center.x-(xOffset), y, arena.center.z, "fencing_01_90");
    }

    //bottom
    for (let y = bottom_left_starting_point_y; y < bottom_left_ending_point_y; y++) {
        createWall(arena.center.x+(xOffset), y, arena.center.z, "fencing_01_90");
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


  export const createWall = (x: number, y: number, z: number, wallname: string) => {
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


export interface ArenaConfig {
  center: Coordinates;
  height: number;
  width: number;
  loot: Loot[];
}

export const createArena = (name: string) => {
  //Arena Walls
  const arena = loadArena(name);
  if (arena == null) {
    print("Arena not found");
    return;
  }
  buildArenaWalls(arena);
  spawnAllLoot(arena.loot);
}


export const saveArena = (arena: ArenaConfig, name: string) => {
  const fileWriter = getFileWriter(name+".json", true, false);
  fileWriter.write(dkjson.encode(arena, {indent: true}));
  fileWriter.close();
  // const buffer = new BufferedWriter(fileWriter);
  // buffer.write("arena test");
}

export const loadArena = (name: string): ArenaConfig | null => {
  const fileReader = getFileReader(name+".json", false);
  let buffer = "";
  let line = fileReader.readLine();
  while (line != null) {
    buffer = buffer.concat(line);
    line = fileReader.readLine();
  }
  const arena = dkjson.decode(buffer);
  return arena as ArenaConfig;
}