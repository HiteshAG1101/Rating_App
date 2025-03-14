import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth-context';

const DashboardPage = () => {
    const { auth } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                if (auth.user.role === 'admin') {
                    const res = await axios.get('http://localhost:3000/users/dashboard', {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    });
                    setDashboardData(res.data);
                } else if (auth.user.role === 'store_owner') {
                    const res = await axios.get('http://localhost:3000/stores/my-store', {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    });
                    setDashboardData(res.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching dashboard data');
            }
        };
        fetchDashboard();
    }, [auth]);

    if (!auth.user) {
        return <p>Please log in to view the dashboard.</p>;
    }

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            {error && <div className="error">{error}</div>}
            {auth.user.role === 'admin' && dashboardData && (
                <div className="card">
                    <p>Total Users: {dashboardData.total_users}</p>
                    <p>Total Stores: {dashboardData.total_stores}</p>
                    <p>Total Ratings: {dashboardData.total_ratings}</p>
                </div>
            )}
            {auth.user.role === 'store_owner' && dashboardData && (
                <div className="card">
                    <h3 className="store-title">{dashboardData.store.name}</h3>
                    <p>Address: {dashboardData.store.address}</p>
                    <p>Average Rating: {dashboardData.average_rating ? dashboardData.average_rating.toFixed(2) : 'N/A'}</p>
                    <h4>Ratings</h4>
                    {dashboardData.ratings && dashboardData.ratings.map((r, idx) => (
                        <div key={idx} className="rating-card">
                            <p>{r.user}: {r.rating}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
