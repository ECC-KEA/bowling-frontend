import React, { useState } from "react";
import useInventoryItems from '../hooks/useInventoryItems';
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import PageLayout from "../components/PageLayout.tsx";
import { MdOutlineDelete, MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { BiEditAlt } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { NewInventoryItem } from '../types/inventoryItem.types';

const InventoryItem = () => {
    const { inventoryItems, loading, updateStockQuantity, deleteInventoryItem, createInventoryItem } = useInventoryItems();
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [name, setName] = useState('');

    interface ButtonProps {
        onClick: () => void;
        className?: string;
        children: React.ReactNode;
        hidden?: boolean;
    }

    const handleEditClick = (id: number, currentQuantity: number) => {
        setEditItemId(id);
        setQuantity(currentQuantity);
    }

    const handleSaveClick = () => {
        if (editItemId !== null) {
            void updateStockQuantity(editItemId, quantity);
            setEditItemId(null);
        }
    }

    const handleClear = () => {
        setName('');
        setQuantity(0);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newItem: NewInventoryItem = { name, quantity };
        await createInventoryItem(newItem);
        handleClear();
    };

    const Button: React.FC<ButtonProps> = ({ onClick, className, children, hidden }) => {
        if (hidden) {
            return null;
        }
        return (
            <button onClick={onClick} className={`px-2 py-1 text-white rounded cursor-pointer ${className}`}>
                {children}
            </button>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-96">
                <LoadingSpinner />;
            </div>
        )
    }

    return (
        <PageLayout>
            <div className="flex">
                <div className="flex-grow overflow-x-auto">
                    <table className="max-w-full bg-white border border-gray-200 m-10">
                        <thead>
                        <tr>
                            <th className="px-48 py-2 border-b">Product name</th>
                            <th className="px-4 py-2 border-b">Stock quantity</th>
                            <th className="px-4 py-2 border-b"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventoryItems.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr key={item.id} className="hover:bg-gray-light">
                                    <td className="px-6 py-2 border-b">{item.name}</td>
                                    <td className="px-4 py-2 border-b text-center">{item.quantity}</td>
                                    <td className="px-10 py-2 border-b">
                                        <Button
                                            onClick={() => handleEditClick(item.id, item.quantity)}
                                            className="bg-gray-dark"
                                            hidden={editItemId === item.id}
                                        >
                                            <BiEditAlt />
                                        </Button>
                                    </td>
                                </tr>
                                {editItemId === item.id && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 border-b">
                                            <div className="flex flex-col items-center space-y-2 mt-2">
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    className="border p-1"
                                                />
                                                <div className="flex space-x-8">
                                                    <Button
                                                        onClick={() => setEditItemId(null)}
                                                        className="bg-gray border border-gray-300"
                                                    >
                                                        <MdOutlineKeyboardBackspace />
                                                    </Button>
                                                    <Button
                                                        onClick={handleSaveClick}
                                                        className="bg-green border border-green-300"
                                                    >
                                                        <FaCheck />
                                                    </Button>
                                                    <Button
                                                        onClick={() => deleteInventoryItem(item.id)}
                                                        className="bg-red border border-red-400"
                                                    >
                                                        <MdOutlineDelete />
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/3 p-4">
                    <div className="p-4 bg-gray-dark text-white mt-8 mr-8">
                        <h2 className="text-xl mb-4">Add Item</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border text-gray-dark"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full p-2 border text-gray-dark"
                                    required
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green rounded-md text-gray-dark"
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-4 py-2 bg-gray-medium rounded-md text-gray-dark"
                                >
                                    <MdClear />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default InventoryItem;
