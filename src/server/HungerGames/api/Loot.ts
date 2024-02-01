import { InventoryItem, IsoObject, getWorld, isServer } from "@asledgehammer/pipewrench";

interface Coordinates {
    x: number;
    y: number;
    z: number;

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

interface Loot {
    type: LootType[];
    location: Coordinates;
    size: ContainerSize;
}


//Possible Containers
const BigCrate: string[] = ["carpentry_01_18"]


// Possible items
const WeaponList: string[] = ["HCMakeshiftaxe", "HCBattleaxeiron"]
const FoodList: string[] = []
const MedicalList: string[] = []
const OtherList: string[] = []


const createContainer = (loot: Loot) => {
    //possible items
    const itemList: string[] = [];
    // Add items to the list based on the loot type
    for (const type of loot.type) {
        switch (type) {
            case LootType.Food:
                itemList.push(...FoodList);
                break;
            case LootType.Weapons:
                itemList.push(...WeaponList);
                break;
            case LootType.Medical:
                itemList.push(...MedicalList);
                break;
            case LootType.Other:
                itemList.push(...OtherList);
                break;
        }
    }
    // Select items to be added in crate
    const spawnedItems = getRandomItems(itemList);
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

const getRandomItems = (itemList: string[]) => {
    const items: string[] = [];
    const numberOfItems = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numberOfItems; i++) {
        const item = itemList[Math.floor(Math.random() * itemList.length)];
        items.push(item);
    }
    return items;
}


const spawnContainer = (object_name: string, location: Coordinates, item_list: string[]) => {
    if(!isServer()) return;

    //Get cell + spawn IsoObject
    const cell = getWorld().getCell();
    const square = cell.getGridSquare(location.x, location.y, location.z);
    const object = new IsoObject(cell, square, object_name,  false)
    object.setName("hg_container");

    //Fill container with loot
    let container = object.getContainer();
    for (const item of item_list) {
        let added = container.AddItem(item);
        container.addItemOnServer(added as InventoryItem);
    }

    //Transmit Object to clients
    square.AddSpecialObject(object);
    object.transmitCompleteItemToClients();
}


const spawnAllLoot = (lootList: Loot[]) => {
    for (const loot of lootList) {
        createContainer(loot);
    }
}