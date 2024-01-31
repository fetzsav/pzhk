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

const WeaponList: string[] = ["HCMakeshiftaxe", "HCBattleaxeiron"]
const FoodList: string[] = []
const MedicalList: string[] = []
const OtherList: string[] = []


const createContainer = (loot: Loot) => {
    //possible items
    let itemList: string[] = [];

    // Add items to the list based on the loot type
    for (const type of loot.type) {
        switch (type) {
            case LootType.Food:
                itemList.push.apply(itemList, FoodList);
                break;
            case LootType.Weapons:
                itemList.push.apply(itemList, WeaponList);
                break;
            case LootType.Medical:
                itemList.push.apply(itemList, MedicalList);
                break;
            case LootType.Other:
                itemList.push.apply(itemList, OtherList);
                break;
        
        }
    }


    // Select items to be added in crate

}

const spawnLoot = (lootList: Loot[]) => {
    for (const loot of lootList) {
        createContainer(loot);
    }
}