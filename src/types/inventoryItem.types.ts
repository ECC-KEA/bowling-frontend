interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
}

interface NewInventoryItem {
    name: string;
    quantity: number;
}

interface UpdateInventoryItem {
    id?: number;
    name?: string;
    quantity?: number;
}


export type {InventoryItem, NewInventoryItem, UpdateInventoryItem};