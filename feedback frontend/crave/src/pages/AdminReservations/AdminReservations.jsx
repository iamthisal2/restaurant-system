import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminReservations.css'; 
import AdminReservationModal from '../../components/AdminReservationModal/AdminReservationModal';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllReservations = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }, []);

    useEffect(() => {
        fetchAllReservations();
    }, [fetchAllReservations]);

    // Apply filters whenever reservations or filter states change
    // Apply filters whenever reservations or filter states change
useEffect(() => {
    const filtered = reservations.filter(reservation => {
        // Status filter
        if (statusFilter !== 'all' && reservation.status !== statusFilter) {
            return false;
        }

        // Time period filter
        const reservationDate = new Date(reservation.reservationDate);
        const today = new Date();
        
        // Reset times to compare dates only (important!)
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        if (timeFilter === 'upcoming' && reservationDate < todayStart) {
            return false;
        }
        if (timeFilter === 'past' && reservationDate >= todayStart) {
            return false;
        }
        if (timeFilter === 'today') {
            // Check if reservation date is within today's range
            if (reservationDate < todayStart || reservationDate > todayEnd) {
                return false;
            }
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                reservation.customerName.toLowerCase().includes(term) ||
                reservation.customerEmail.toLowerCase().includes(term)
            );
        }

        return true;
    });

    setFilteredReservations(filtered);
}, [reservations, statusFilter, timeFilter, searchTerm]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:8080/api/reservations/${id}/status`, { status: newStatus });
            fetchAllReservations();
        } catch (error) {
            alert(`Failed to update status to ${newStatus}.`);
            console.error(error);
        }
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setTimeFilter('upcoming');
        setSearchTerm('');
    };

    const getReservationCounts = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
            total: reservations.length,
            pending: reservations.filter(r => r.status === 'Pending').length,
            confirmed: reservations.filter(r => r.status === 'Confirmed').length,
            cancelled: reservations.filter(r => r.status === 'Cancelled').length,
            upcoming: reservations.filter(r => new Date(r.reservationDate) >= today).length,
            past: reservations.filter(r => new Date(r.reservationDate) < today).length,
        };
    };

    const counts = getReservationCounts();

    return (
        <>
            {isModalOpen && <AdminReservationModal onClose={() => setIsModalOpen(false)} onReservationCreated={fetchAllReservations} />}
            <div className='admin-page'>
                <div className="admin-header">
                    <h1>Manage All Reservations</h1>
                    <button onClick={() => setIsModalOpen(true)} className="add-fab">
                        <span className="plus-icon">+</span>
                        Add a new reservation
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <span className="stat-number">{counts.total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-card pending">
                        <span className="stat-number">{counts.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card confirmed">
                        <span className="stat-number">{counts.confirmed}</span>
                        <span className="stat-label">Confirmed</span>
                    </div>
                    <div className="stat-card upcoming">
                        <span className="stat-number">{counts.upcoming}</span>
                        <span className="stat-label">Upcoming</span>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label>Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Time Period:</label>
                        <select 
                            value={timeFilter} 
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                            <option value="today">Today</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    Showing {filteredReservations.length} of {reservations.length} reservations
                </div>

                {/* Reservations List */}
                <div className='admin-reservations-list vertical'>
                    {filteredReservations.length > 0 ? filteredReservations.map(res => (
                        <div key={res.id} className={`admin-reservation-card ${res.status.toLowerCase()}`}>
                            <p><strong>Name:</strong> {res.customerName} ({res.customerEmail})</p>
                            <p><strong>Date:</strong> {res.reservationDate} at {res.reservationTime.slice(0, 5)}</p>
                            <p><strong>Guests:</strong> {res.numberOfGuests}</p>
                            <p><strong>Status:</strong> <span className='status-badge'>{res.status}</span></p>
                            <div className="admin-actions">
                                {res.status === 'Pending' && (
                                    <button onClick={() => handleUpdateStatus(res.id, 'Confirmed')} className='confirm-btn'>Confirm</button>
                                )}
                                {res.status !== 'Cancelled' && (
                                    <button onClick={() => handleUpdateStatus(res.id, 'Cancelled')} className='cancel-btn admin'>Cancel</button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="no-results">
                            <p className="no-reservation-text">No reservations found matching your filters.</p>
                            <button onClick={clearFilters} className="clear-filters-btn">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminReservations;