import React, {Component, useState, useEffect} from 'react';
import './App.css';
import { getImages, searchImages } from './api'
function App(props) {
    const [imageList, setImageList] = useState([]);
    const [nextCursor, setNextCursor] = useState(null)
    const [searchValue, setSearchValue] = useState('');
    useEffect( ()=> {
        const fetchData = async () => {
            const JsonRes = await getImages()
            setImageList(JsonRes.resources)
            setNextCursor(JsonRes.next_cursor)
        }
        fetchData();

    }, [])

    const handleButton = async () => {
        const JsonRes = await getImages(nextCursor)
        setImageList((currentImageList) => [
            ...currentImageList,
            ...JsonRes.resources,
        ])
        setNextCursor(JsonRes.next_cursor)
    }

    const handleSearch = async (event) => {
        event.preventDefault();
        const JsonRes = await searchImages(searchValue, nextCursor);
        setImageList(JsonRes.resources);
        setNextCursor(JsonRes.next_cursor);
    }

    const resetSearch = async () => {
        const JsonRes = await getImages();
        setImageList(JsonRes.resources);
        setNextCursor(JsonRes.next_cursor);
        setSearchValue('');
    }
    return (
        <>
            <form onSubmit={handleSearch}>
                <input value={searchValue}
                       onChange={(event) => setSearchValue(event.target.value)}
                       required='require'
                       placeholder='Enter Search value'
                />
                <button type='submit'> Search </button>
                <button type='button' onClick={resetSearch}> Clear </button>
            </form>
            <div className='image-grid'>
            {
                imageList.map( (image) => (
                <img src= {image.url} alt={image.public_id}>
                </img>
                ))
            }
            </div>
            <div className='footer'>
                {nextCursor && <button onClick={handleButton}> Load More</button>}
            </div>
        </>

    );
}

export default App;
