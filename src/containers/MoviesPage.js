import React from 'react';
import { Route, Switch } from 'react-router-dom'; // notice we are now importing Switch
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';
import MoviesNew from './MoviesNew';

const MoviesPage = ({ match, movies }) =>
  <div>
    <MoviesList movies={movies} />
    <Switch> {/* Make sure to wrap all of your Routes as children of the Switch component*/ }
      <Route path={`${match.url}/new`} component={MoviesNew} />
      <Route path={`${match.url}/:movieId`} component={MovieShow}/>
      <Route exact path={match.url} render={() => (
        <h3>Please select a Movie from the list.</h3>
      )}/>
    </Switch>
  </div>;

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);
