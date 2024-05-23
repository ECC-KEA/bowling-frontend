import { useState, useEffect } from "react";
import DataService from "../utils/DataService";
import { InventoryItem } from "../types/inventoryItem.types";
import toast from "react-hot-toast";

const useInventoryItems = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            const dataService = new DataService<InventoryItem>("/inventory");

            try {
                const items = await dataService.getAll();
                setInventoryItems(items);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error("Failed to fetch inventory items: " + error.message);
                }
            }
        };

        fetchInventoryItems().then(() => setLoading(false));
    }, []);

    return { inventoryItems, loading };
};

export default useInventoryItems;
