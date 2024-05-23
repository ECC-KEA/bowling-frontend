import { useState, useEffect } from "react";
import DataService from "../utils/DataService";
import { InventoryItem } from "../types/inventoryItem.types";
import toast from "react-hot-toast";

const useInventoryItems = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dataService = new DataService<InventoryItem>("/inventory");

    useEffect(() => {
        const fetchInventoryItems = async () => {
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

    const updateStockQuantity = async (id: number, newQuantity: number) => {
        try {
            await dataService.patch({ quantity: newQuantity }, id);
            setInventoryItems(prevItems =>
                prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
            );
            toast.success("Stock updated successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to update stock: " + error.message);
            }
        }
    };

    const deleteInventoryItem = async (id: number) => {
        try {
            await dataService.delete(id);
            setInventoryItems(prevItems => prevItems.filter(item => item.id !== id));
            toast.success("Item deleted successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to delete item: " + error.message);
            }
        }
    };

    return { inventoryItems, loading, updateStockQuantity, deleteInventoryItem };
};

export default useInventoryItems;
