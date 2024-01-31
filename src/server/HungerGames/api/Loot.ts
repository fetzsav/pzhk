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

const AxeList: string[] = ["HCMakeshiftaxe", "HCBattleaxeiron"]


const createContainer = (loot: Loot) => {
    print("unimplemented");
}

const spawnLoot = (lootList: Loot[]) => {
    for (const loot of lootList) {
        createContainer(loot);
    }
}