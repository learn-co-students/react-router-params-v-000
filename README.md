### Params and Redirects

### Objectives
  * Learn how __React Router__ passes through params to a __React Router__ rendered component
  * Learn how to use __React Router__ to change the displayed url  

### Review

In the previous lesson, we successfully created our nested route, and saw how to render the __MovieShow__ component.  While our application now renders the __MovieShow__ component upon visitng a url like `/movies/3`, we are not yet displaying information from that particular movie with the id of 3. Let's change this.  

### Dynamically finding the show

 Let's wire up our `MovieShow` component to dynamically render the info about the movie based on the URL. The steps to do so will be as follows:

1. Connect our __MovieShow__ component to our __Redux__ store so that it knows about the list of movies.
2. Find the movie where the movie's id matches the `:movieId` param of our route.
3. Make that movie available to the component via `props`.

First, let's import `connect` and use our `mapStateToProps` function to let our `MoviesShow` component know about changes to the store.

```javascript
// ./src/containers/MovieShow.js
import React from 'react';
import { connect } from 'react-redux';

const MovieShow = props =>
  <div>
    <h3>Movie Show Component!</h3>
  </div>;

const mapStateToProps = (state) => {}

export default connect(mapStateToProps)(MovieShow);
```

Now, in `mapStateToProps`, we'd like to access the `:movieId` supplied to us via the URL. We need to understand two things for this to work.

1. `mapStateToProps` takes a second argument of props that were passed directly to the component. We usually refer to these as `ownProps`
2. React Router will supply any dynamic pieces of the URL to the component via an object called `match.params` as own props of the related component.  

This means that we can access the `:movieId` from the URL via `match.params` on our `ownProps`

```javascript
// ./src/containers/MovieShow.js
import React from 'react';
import { connect } from 'react-redux';

const MovieShow = props =>
  <div>
    <h3>Movie Show Component!</h3>
  </div>;

const mapStateToProps = (state, ownProps) => {
  return {
    movieId: ownProps.match.params.movieId
  }
}

export default connect(mapStateToProps)(MovieShow);
```

Note that we have a property called `movieId` because of the way we defined our route. If we defined our dynamic portion to be `/movies/:dog`, we'd have a `dog` property in our `match.params`.

Now, we can simply iterate through our list of movies and return the one where our `route` matches.

```javascript
// ./src/containers/MovieShow.js
import React from 'react';
import { connect } from 'react-redux';

const MovieShow = props =>
  <div>
    <h3>Movie Show Component!</h3>
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
```

Now, assuming we find a movie, we simply add it to the props. To account for the case where a movie isn't found, we return just an empty object as the movie.

The last thing we need to do is add the title in our MovieShow's render function.

```js
// ./src/containers/MovieShow.js
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
```

### Adding the New Option

Let's add our second nested route. Going to '/movies/new' should display the `MoviesNew` component.

We've already created out `MoviesNew` component - it's a simple form that dispatches the `addMovie` action on submission. Let's add that into our Route, the same way we did with our `Show` component.

Note that we **must** define our `/movies/new` route first. Why? Because otherwise, the `/:id` route handler would catch it first and assessing `"new"` to be the id.

Let's add a link to our Movies List to add a new movie.

```javascript
// src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';
import MoviesNew from './MoviesNew';

const MoviesPage = ({ match, movies }) => 
  <div>
    <MoviesList movies={movies} />
    <Route path={`${match.url}/new`} component={MoviesNew} />
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
```

And lets not forget to add a link in our `NavBar` component to go to this URL.

```js
// ./src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = props => {
  return (
    <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '12px' }}>
      <NavLink 
        style={{ marginRight: '10px' }} 
        to="/"
      >
        Home
      </NavLink>
      <NavLink 
        style={{ marginRight: '10px' }} 
        to="/movies"
      >
        Movies
      </NavLink>
      <NavLink 
        style={{ marginRight: '10px' }} 
        to="/movies/new"
      >
        Add Movie
      </NavLink>
    </div>
  );
}

export default NavBar;
```

So let's try this out in the browser to see if it loads the `MoviesNew` component. Everything looks good except for one thing. It is now loading the `MoviesNew` & the `MovieShow` component. Why is that?? Well, if you notice `movies/new` and `movies/:movieId` could look like the same route to React Router unless we are more explicit. I think it is time to introduce __React Router's Switch__ component. The __Switch__ component's real power is that it uniquely renders a route exclusively. Compare this to the __Route__ component that renders inclusively all of the matching routes (which is why it is rendering both components right now). Let's update our __MoviesPage__ component so that is now using the __Switch__ component.

```js
// ./src/containers/MoviesPage.js
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
```

### Redirecting

Finally, it would be nice if after creating the new Movie, we could "redirect" the user back to the '/movies' route. Luckily, React Router gives us a nice interface to do this.

All of our components that are nested within `<Router>`, which is currently all of our application, have passed down props of `history`. Thie `history` object has a function call `push()` that take in a url string to update the page URL and redirect. Let's add this to our __MoviesNew's handleOnSubmit()__ function. 

```javascript
//src/containers/MoviesNew
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMovie } from '../actions';

class MoviesNew extends Component {

  constructor() {
    super();

    this.state = {
      title: ''
    };
  }

  handleOnSubmit = event => {
    event.preventDefault();
    // Destructure addMovie and history from the components props
    const { addMovie, history } = this.props;
    // Create the movie with the Redux action
    addMovie(this.state);
    // redirect to /movies route
    history.push('/movies')
  }

  handleOnChange = event => {
    this.setState({
      title: event.target.value
    });
  }

  render(){
    return (
      <form style={{ marginTop: '16px' }} onSubmit={this.handleOnSubmit} >
        <input 
          type="text" 
          onChange={this.handleOnChange} 
          placeholder="Add a Movie" />
        <input type="submit" value="Add Movie" />
      </form>
    );
  }
}

export default connect(null, { addMovie })(MoviesNew)
```

Now when we add a movie we are sent back to our `/movies` and it loads the `MoviesPage` component. 

### Summary

So in this section we saw how upon visiting a url, React Router will supply any dynamic pieces of the URL to the related component via an object called `match.params`. We then saw how to access those props in our mapStateToProps function as ownProps, and how to use those props to find the related movie.

Then we saw how after taking an action like creating a new movie, we can change the url by using the `history` object that is supplied to our component as props. So a call to `history.push('/movies')` changes the url to `/movies`.

<p class='util--hide'>View <a href='https://learn.co/lessons/react-router-params'>React Router Params</a> on Learn.co and start learning to code for free.</p>
