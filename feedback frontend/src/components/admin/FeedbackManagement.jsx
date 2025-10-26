import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { showErrorToast } from '../../utils/toast.utils';

const FeedbackManagement = () => {
    const { feedbacks, loading, deleteFeedback, addFeedbackResponse,fetchFeedbacks } = useAdmin();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseText, setResponseText] = useState('');

    const handleDelete = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await deleteFeedback(feedbackId);
            } catch (error) {
                console.error('Error deleting feedback:', error);
                showErrorToast('Failed to delete feedback');
            }
        }
    };

    const handleAddResponse = async (feedbackId) => {
        if (!responseText.trim()) return;

        try {
            await addFeedbackResponse(feedbackId, { responseText: responseText });
            setShowResponseModal(false);
            setResponseText('');
            setSelectedFeedback(null);
            fetchFeedbacks()
        } catch (error) {
            console.error('Error adding response:', error);
            showErrorToast('Failed to add response');
        }
    };

    const getStatusColor = (hasResponse) => {
        return hasResponse ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">
                <div className="text-sm text-gray-600">
                    Total Feedbacks: {feedbacks.length}
                </div>
            </div>

            {/* Feedback Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">💬</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Feedbacks</p>
                            <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">✅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Responded</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {feedbacks.filter(f => f.isResponded).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">⏳</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {feedbacks.filter(f => !f.isResponded).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedbacks Table */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating
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
                        {feedbacks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    <div className="text-4xl mb-4">💬</div>
                                    <p>No feedbacks found</p>
                                    <p className="text-sm">Customer feedbacks will appear here.</p>
                                </td>
                            </tr>
                        ) : (
                            feedbacks.map((feedback) => (
                                <tr key={feedback.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {feedback.authorName?.charAt(0) || 'C'}
                                                    </span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {feedback.authorName || 'Anonymous'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {feedback.authorEmail || 'No email'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {feedback.content || 'No message'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {feedback.rating} / 5.0
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.isResponded)}`}>
                                                {feedback.isResponded ? 'Responded' : 'Pending'}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedFeedback(feedback)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                            {!feedback.isResponded && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedFeedback(feedback);
                                                        setShowResponseModal(true);
                                                    }}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Respond
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(feedback.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Feedback Details Modal */}
            {selectedFeedback && !showResponseModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
                            <h3 className="text-xl font-semibold text-gray-900">Feedback Details</h3>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedFeedback?.authorName || 'Anonymous'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedFeedback?.authorEmail || 'No email'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                                    {selectedFeedback?.content || 'No content provided'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {selectedFeedback?.rating} / 5.0
                                </p>
                            </div>

                            {selectedFeedback.response && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Admin Response</label>
                                    <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md mt-1">
                                        {selectedFeedback.response?.responseText}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Add Response</h3>
                            <button
                                onClick={() => {
                                    setShowResponseModal(false);
                                    setSelectedFeedback(null);
                                    setResponseText('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Message
                                </label>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                    {selectedFeedback.content || 'No message'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Response
                                </label>
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    rows="4"
                                    placeholder="Type your response here..."
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowResponseModal(false);
                                        setSelectedFeedback(null);
                                        setResponseText('');
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAddResponse(selectedFeedback.id)}
                                    disabled={loading || !responseText.trim()}
                                    className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {loading ? 'Sending...' : 'Send Response'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackManagement;