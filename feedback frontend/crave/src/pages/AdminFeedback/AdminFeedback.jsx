import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Reuse the modals and CSS from AllFeedback for consistency
import '../AllFeedback/AllFeedback.css';
import './AdminFeedback.css'; // Add specific admin styles if needed
import EditFeedbackModal from '../../components/EditFeedbackModal/EditFeedbackModal';
import ResponseModal from '../../components/ResponseModal/ResponseModal';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [respondingTo, setRespondingTo] = useState(null);

    const fetchFeedbacks = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/feedbacks");
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    }, []);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axios.delete(`http://localhost:8080/api/feedbacks/${id}`);
                fetchFeedbacks();
            } catch (error) {
                console.error("Failed to delete feedback", error);
            }
        }
    };

    return (
        <>
            {editingFeedback && <EditFeedbackModal feedback={editingFeedback} onClose={() => setEditingFeedback(null)} onUpdate={fetchFeedbacks} />}
            {respondingTo && <ResponseModal feedbackId={respondingTo.id} onClose={() => setRespondingTo(null)} onRespond={fetchFeedbacks} />}

            <div className='admin-page'>
                <h1>Manage Guest Feedback</h1>
                <div className='feedback-list-container'>
                    {feedbacks.map((item) => (
                        <div key={item.id} className='feedback-item'>
                            <div className='card-top-border'></div>
                            <h3>{item.authorName} ({item.email})</h3>
                            <p className='rating'>Rating: {item.rating}/5</p>
                            <p className='content'>"{item.content}"</p>
                            {item.response && (
                                <div className='admin-response'>
                                    <h4>Admin Response:</h4>
                                    <p>{item.response.responseText}</p>
                                </div>
                            )}
                            <div className='feedback-actions'>
                                {/* Admin can always edit/delete? Or only edit user details? */}
                                {/* <button onClick={() => setEditingFeedback(item)}>Edit</button> */}
                                <button onClick={() => handleDelete(item.id)} className='delete-btn'>Delete</button>
                                {!item.response && (
                                    <button onClick={() => setRespondingTo(item)} className='respond-btn'>Respond</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminFeedback;