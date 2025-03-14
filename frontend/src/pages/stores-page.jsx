import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth-context';

const StoresPage = () => {
    const { auth } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState({ name: '', address: '' });
    const [error, setError] = useState('');
    const [ratingValues, setRatingValues] = useState({}); // To track rating inputs for each store

    useEffect(() => {
        fetchStores();
    }, [search]);

    const fetchStores = async () => {
        try {
            const params = {};
            if (search.name) params.name = search.name;
            if (search.address) params.address = search.address;
            const res = await axios.get('http://localhost:3000/stores', {
                headers: { Authorization: `Bearer ${auth.token}` },
                params,
            });
            setStores(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching stores');
        }
    };

    // Update the rating value for a specific store
    const handleRatingChange = (storeId, value) => {
        setRatingValues((prev) => ({ ...prev, [storeId]: value }));
    };

    // Submit rating for a specific store
    const handleRatingSubmit = async (storeId) => {
        const rating = parseInt(ratingValues[storeId], 10);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert("Please enter a valid rating between 1 and 5");
            return;
        }
        try {
            await axios.put(
                `http://localhost:3000/ratings/${storeId}/rating`,
                { rating },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            // Refresh the stores to get updated ratings
            fetchStores();
        } catch (err) {
            console.error("Rating submission error:", err);
            alert("Failed to submit rating");
        }
    };

    return (
        <div>
            <h2 className="page-title">Stores</h2>
            {error && <div className="error">{error}</div>}
            <div className="search-group">
                <input
                    type="text"
                    name="name"
                    value={search.name}
                    onChange={(e) => setSearch({ ...search, name: e.target.value })}
                    placeholder="Search by name"
                    className="input search-input"
                />
                <input
                    type="text"
                    name="address"
                    value={search.address}
                    onChange={(e) => setSearch({ ...search, address: e.target.value })}
                    placeholder="Search by address"
                    className="input search-input"
                />
            </div>
            <div>
                {stores.map((store) => (
                    <div key={store.id} className="card store-card">
                        <h3 className="store-title">{store.name}</h3>
                        <p>{store.address}</p>
                        <p>
                            Overall Rating:{" "}
                            {store.average_rating ? store.average_rating.toFixed(2) : "N/A"}
                        </p>
                        {auth.user && auth.user.role === "normal" && (
                            <div>
                                <p>Your Rating: {store.user_rating || "Not rated"}</p>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="Enter rating (1-5)"
                                    value={ratingValues[store.id] || ""}
                                    onChange={(e) => handleRatingChange(store.id, e.target.value)}
                                    className="input rating-input"
                                />
                                <button onClick={() => handleRatingSubmit(store.id)} className="button">
                                    Submit Rating
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoresPage;
