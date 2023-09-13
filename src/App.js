import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_KEY = process.env.API_KEY;

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
            const response = await axios.get('https://api.thecatapi.com/v1/images/search?limit=4', {
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

    const createCat = () => {
        // Create a new cat and send it to the server
        axios.post('/http://localhost:3001/', { title, imgUrl }).then((response) => {
            setCats([...cats, response.data]);
            setTitle('');
            setImgUrl('');
        });
    };

    const deleteCat = (id) => {
        // Delete a cat by ID and update the cats state
        axios.delete(`/http://localhost:3001/${id}`).then(() => {
            setCats(cats.filter((cat) => cat.id !== id));
        });
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
                        <label htmlFor="imgUrl">Image URL</label>
                        <input
                            name="imgUrl"
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
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
