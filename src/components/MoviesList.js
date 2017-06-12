import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = movies.map(movie => 
    <Link style={{ marginRight: '12px' }} key={movie.id} to={`/movies/${movie.id}`}>{movie.title}</Link>
  );
  
  return (
    <div>
      {renderMovies}
    </div>
  );
};

export default MoviesList;