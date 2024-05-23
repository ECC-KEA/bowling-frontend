import useInventoryItems from '../hooks/useInventoryItems';
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import PageLayout from "../components/PageLayout.tsx";

const InventoryItem = () => {
    const { inventoryItems, loading } = useInventoryItems();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <PageLayout>
            <div className="overflow-x-auto">
                <table className="max-w-full bg-white border border-gray-200 m-10">
                    <thead>
                    <tr>
                        <th className="px-48 py-2 border-b">Product name</th>
                        <th className="px-4 py-2 border-b">Stock quantity</th>
                        <th className="px-4 py-2 border-b">Edit stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventoryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-light">
                            <td className="px-6 py-2 border-b">{item.name}</td>
                            <td className="px-4 py-2 border-b text-center">{item.quantity}</td>
                            <td className="px-4 py-2 border-b">
                                <div className="flex justify-center items-center space-x-2">
                                    <button className="px-2 py-1 text-white bg-red rounded cursor-pointer">-</button>
                                    <button className="px-2 py-1 text-white bg-green rounded cursor-pointer">+</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
}

export default InventoryItem;
