import React from 'react';
import { connect } from 'react-redux';

const MovieShow = ({ movie }) =>
  <div>
    <h3>Title: {movie.title}</h3>
  </div>

const mapStateToProps = (state, ownProps) => {
  const movie = state.movies.find(movie => movie.id == ownProps.match.params.movieId)

  if (movie) {
    return { movie }
  } else {
    return { movie: {} }
  }
}

export default connect(mapStateToProps)(MovieShow);
