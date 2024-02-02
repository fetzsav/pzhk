import { IsoPlayer, IsoThumpable, getWorld, isServer } from "@asledgehammer/pipewrench";
import { ContainerSize, Coordinates, Loot, LootType, spawnAllLoot } from "./Loot";

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


  export const createWall = (x: any, y: any, z: any, wallname: string) => {
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




// ARENA 1 PRIMS

export const createArena1 = () => {

  //Arena Walls
  const ArenaCenter: Coordinates = {
    x: 7221,
    y: 5532,
    z: 0
  }
  const ArenaHeight = 30;
  const ArenaWidth = 30;
  createArena(ArenaCenter.x, ArenaCenter.y, ArenaCenter.z, ArenaHeight, ArenaWidth);
  //Arena Loot
  const bigLootLocations: Coordinates[] = [
    {x: 7221, y: 5529, z: 0},
    {x: 7221, y: 5532, z: 0},
    {x: 7223, y: 5529, z: 0},
    {x: 7223, y: 5532, z: 0},
  ]

  const LootList: Loot[] = [];

  for (const coords of bigLootLocations) {
    const loot: Loot = {
      location: coords,
      size: ContainerSize.Large,
      type: [LootType.Weapons]
    }
    LootList.push(loot);
  }
  spawnAllLoot(LootList);

}