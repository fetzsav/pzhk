import { BufferedWriter, InventoryItem, IsoObject, ItemContainer, ZombRand, getPlayer, getWorld, isServer } from "@asledgehammer/pipewrench";

export interface Coordinates {
    x: number;
    y: number;
    z: number;

}

export enum LootType {
    Food,
    Weapons,
    Medical,
    Other
}

export enum ContainerSize {
    Small,
    Medium,
    Large
}

export interface Loot {
    type: LootType[];
    location: Coordinates;
    size: ContainerSize;
}


//Possible Containers
const BigCrate: string[] = ["carpentry_01_18"]


// Possible items
const WeaponList: string[] = ["Base.Axe", "Base.BaseballBat", "Base.Broom", "Base.Crowbar", "Base.Shovel", "Base.HandScythe", "Base.PipeWrench", "Base.SnowShovel"]
const ArmorList: string[] = ["Base.Hat_Army", "Base.Hat_BalaclavaFace", "Base.Hat_BalaclavaFull", "Base.Hat_HockeyHelmet", "Base.Hat_RidingHelmet"]
const FoodList: string[] = ["Base.CannedPeachesOpen", "Base.CannedPineappleOpen", "Base.CannedFruitCocktailOpen", "Base.BerryBlue", "Base.Pancakes"]
const MedicalList: string[] = ["Base.AlcoholRippedSheets", "Base.Pills", "Base.Bandage", "Base.Bandaid", "Base.AlcoholWipes", "Base.Disinfectant", "Base.Splint"]
const OtherList: string[] = []


const createContainer = (loot: Loot) => {

    //possible items
    const itemList: string[] = [];
    // Add items to the list based on the loot type
    for (const type of loot.type) {
        switch (type) {
            case LootType.Food:
                for (const food of FoodList) {
                    itemList.push(food);
                }
                break;
            case LootType.Weapons:
                for (const weapon of WeaponList) {
                    itemList.push(weapon);
                }
                break;
            case LootType.Medical:
                for (const medical of MedicalList) {
                    itemList.push(medical);
                }
                break;
            case LootType.Other:
                for (const other of OtherList) {
                    itemList.push(other);
                }
                break;
        }
    }
    
    // Select items to be added in crate
    const spawnedItems = getRandomItems(itemList, 6);
    // Create the container
    switch (loot.size) {
        case ContainerSize.Small:
            // Create small container
            break;
        case ContainerSize.Medium:
            // Create medium container
            break;
        case ContainerSize.Large:
            // Create large container
            spawnContainer(BigCrate[0], loot.location, spawnedItems);
            break;
    }

}

const getRandomItems = (itemList: string[], amount: number) => {
    const items: string[] = [];
    // const numberOfItems = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < amount; i++) {
        const random_index = ZombRand(0, itemList.length);
        const item = itemList[random_index];
        items.push(item);
    }
    return items;
}


export const spawnContainer = (object_name: string, location: Coordinates, item_list: string[]) => {
    if(!isServer()) return;

    //Get cell + spawn IsoObject
    const cell = getWorld().getCell();
    const square = cell.getGridSquare(location.x, location.y, location.z);
    const object = new IsoObject(cell, square, object_name,  false)
    object.setName("hg_container");

    //Fill container with loot
    //Transmit Object to clients
    square.AddSpecialObject(object);
    object.setContainer(new ItemContainer())
    const container = object.getContainer();
    for (const item of item_list) {
        const invItem = new InventoryItem(item, item, item, item);
        const added = container.AddItem(item);
        container.addItemOnServer(invItem);
    }
    object.transmitCompleteItemToClients();
}


export const spawnAllLoot = (lootList: Loot[]) => {
    for (const loot of lootList) {
        createContainer(loot);
    }
}


// 7221, 5529