import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import './App.css';

const API_KEY = '644c26fc'; // Replace with your valid OMDb API key

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('batman');

  const fetchMovies = async (title) => {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
    const data = await res.json();

    if (data.Search) {
      // Fetch full details for each movie
      const moviesWithRatings = await Promise.all(
        data.Search.map(async (movie) => {
          const detailRes = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
          const detailData = await detailRes.json();
          return detailData;
        })
      );

      setMovies(moviesWithRatings);
    } else {
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  return (
    <div className="app">
      <h1>Movie Search 🎬</h1>

      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => fetchMovies(searchTerm)}>🔍</button>
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found 😢</h2>
        </div>
      )}
    </div>
  );
};

export default App;

