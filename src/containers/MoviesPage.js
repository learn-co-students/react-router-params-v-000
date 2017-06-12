import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';

const MoviesPage = ({ match, movies }) => 
  <div>
    <MoviesList movies={movies} />
    <Route path={`${match.url}/:movieId`} component={MovieShow}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a Movie from the list.</h3>
    )}/>
  </div>;

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);