import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { showErrorToast } from '../../utils/toast.utils';

const OrderManagement = () => {
    const { orders,  updateOrderStatus } = useAdmin();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error('Failed to update order status:', error);
            showErrorToast('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'PREPARING':
                return 'bg-blue-100 text-blue-800';
            case 'DELIVERING':
                return 'bg-green-100 text-green-800';
            case 'DELIVERED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="text-sm text-gray-600 text-right">
                Total Orders: {orders.length}
            </div>
            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <div className="text-4xl mb-4">📦</div>
                                        <p>No orders found</p>
                                        <p className="text-sm">Orders will appear here when customers place them.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {order.customerName || 'Unknown Customer'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.customerEmail || 'No email'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Rs. {order.totalAmount || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </button>
                                                <select
                                                    value={order.status || 'PENDING'}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PREPARING">Preparing</option>
                                                    <option value="DELIVERING">Delivering</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Order #{selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                                    <p className="text-sm text-gray-900">{selectedOrder.customerName || 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{selectedOrder.customerEmail || 'No email'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status || 'PENDING'}
                                </span>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                <p className="text-lg font-semibold text-gray-900">Rs. {selectedOrder.totalAmount || '0.00'}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                                <p className="text-sm text-gray-900">
                                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
