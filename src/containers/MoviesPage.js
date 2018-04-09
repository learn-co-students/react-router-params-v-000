import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';
import MoviesNew from './MoviesNew';

const MoviesPage = props =>
  <div>
    <MoviesList movies={props.movies} />
    <Switch>
      <Route path={`${props.match.url}/new`} component={MoviesNew}/>
      <Route path={`${props.match.url}/:movieId`} component={MovieShow}/>
      <Route exact path={props.match.url} render={() => (
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
