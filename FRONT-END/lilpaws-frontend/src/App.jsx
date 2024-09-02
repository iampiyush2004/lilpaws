import './App.css';
import React, { useState, useEffect } from 'react';

function SearchAnimals() {
    const [city, setCity] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cities = ['Chandigarh', 'Panchkula', 'Mohali'];
    const animalTypes = ['Dog', 'Cat', 'Bird'];

    useEffect(() => {
        if (animalType) {
            setLoading(true);
            setError(null);
            fetch(`/api/breeds?animalType=${(animalType)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch breeds');
                    }
                    return response.json();
                })
                .then(data => setBreeds(data.breeds))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            setBreeds([]);
        }
    }, [animalType]);

    const handleSearch = () => {
        setLoading(true);
        setError(null);
        fetch(`http://localhost:3000/pets/search?city=${(city)}&type=${(animalType)}&breed=${(breed)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch pets');
                }
                return response.json();
            })
            .then(data => setResults(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <h1>Search Animals</h1>

            <div>
                <label>City:</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Select a city</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Animal Type:</label>
                <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
                    <option value="">Select an animal type</option>
                    {animalTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Breed:</label>
                <select value={breed} onChange={(e) => setBreed(e.target.value)} disabled={!animalType || loading}>
                    <option value="">Select a breed</option>
                    {breeds.map((breed, index) => (
                        <option key={index} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <div>
                <h2>Search Results</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((pet, index) => (
                            <li key={index}>
                                {pet.type} - {pet.breed} - {pet.city}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}

export default SearchAnimals;
