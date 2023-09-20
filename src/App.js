import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; // Access the API key from the .env file
const BASE_URL = 'https://api.thecatapi.com/v1/images';

function Button({ onClick }) {
    return (
        <button className="btn-delete" onClick={onClick}>
            Delete
        </button>
    );
}

function Cat(props) {
    return (
        <div className="post-card">
            <h2 className="post-title">{props.title}</h2>
            <img src={props.url} alt={props.title} className="post-image" />
            <Button onClick={() => props.deleteCat(props.id)} />
        </div>
    );
}

export default function App() {
    const [cats, setCats] = useState([]);
    const [title, setTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const fetchCats = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/search?limit=4`, {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            setCats(response.data);
        } catch (error) {
            console.error('Error fetching cats:', error);
        }
    };

    useEffect(() => {
        fetchCats();
    }, []);

    const createCat = async () => {
        try {
            // Create a FormData object to send the image file
            const formData = new FormData();
            formData.append('file', imgUrl);

            const response = await axios.post(
                `${BASE_URL}/upload`,
                formData,
                {
                    headers: {
                        'x-api-key': API_KEY,
                    },
                }
            );
            // Assuming the response contains the newly created cat data
            const newCat = response.data;
            setCats((prevCats) => [newCat, ...prevCats]);
            setTitle('');
            setImgUrl('');
        } catch (error) {
            console.error('Error creating cat:', error);
        }
    };

    const deleteCat = async (image_id) => {
        try {
            await axios.delete(`${BASE_URL}/${image_id}`, {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            setCats((prevCats) => prevCats.filter((cat) => cat.id !== image_id));
        } catch (error) {
            console.error('Error deleting cat:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>The Cats</h1>
                <div>
                    <h2>Create Cat</h2>
                    <div className="input-container">
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="imgUrl">Image File</label>
                        <input
                            name="imgUrl"
                            type="file" // Use type "file" for uploading images
                            onChange={(e) => setImgUrl(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn-submit" onClick={createCat}>
                        Add Cat
                    </button>
                    {cats.map((cat) => (
                        <Cat key={cat.id} {...cat} deleteCat={deleteCat} />
                    ))}
                </div>
            </header>
        </div>
    );
}
