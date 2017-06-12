### Params and Redirects

### Objectives
  * Learn how react router passes through params to a React Router rendered component
  * Learn how to use react router to change the displayed url  

### Review

In the previous lesson, we successfully created our nested route, and saw how to render the MovieShow component.  While our application now renders the MoviesShow component upon visitng a url like `/movies/3`, we are not yet displaying information from that particular movie with the id of 3.  Let's change this.  

### Dynamically finding the show

 Let's wire up our `MoviesShow` component to dynamically render the info about the movie based on the URL. The steps to do so will be as follows:

1. Connect our MoviesShow component to the store so that it knows about the list of movies.
2. Find the movie where the movie's id matches the `:id` param of our route.
3. Make that movie available to the component via `props`.

First, let's import `connect` and use our `mapStateToProps` function to let our `MoviesShow` component know about changes to the store.

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';

class MoviesShow extends Component {

  render(){
    return (
      <div>
        Movies Show Component
      </div>
    )
  }
}

function mapStateToProps(state){

}
export default connect(mapStateToProps)(MoviesShow);
```

Now, in `mapStateToProps`, we'd like to access the `:id` supplied to us via the URL. We need to understand two things for this to work.

1. `mapStateToProps` takes a second argument of props that were passed directly to the component. We usually refer to these as `ownProps`
2. React Router will supply any dynamic pieces of the URL to the component via an object called `routeParams` as own props of the related component.  

This means that we can access the `:id` from the URL via `routeParams` on our `ownProps`

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';

class MoviesShow extends Component {

  render(){
    return (
      <div>
        Movies Show Component
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  {movieId: ownProps.routeParams.id} // this will return the dynamic portion of the url.
}

export default connect(mapStateToProps)(MoviesShow);
```

Note that we have a property called `id` because of the way we defined our route. If we defined our dynamic portion to be `/movies/:dog`, we'd have a `dog` property in our `routeParams`.

Now, we can simply iterate through our list of movies and return the one where our `route` matches.

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';

class MoviesShow extends Component {

  render(){
    const movie = this.props.movie; // This just makes our JSX a little more readable
    return (
      <div className='col-md-8'>
        { movie.title }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
   const movie = state.movies.find( ( movie ) => movie.id == ownProps.routeParams.id  )
   if (movie) {
     return {
       movie: movie
     }
   } else {
     return {
       movie: {}
     }
   }
}

export default connect(mapStateToProps)(MoviesShow);
```

Now, assuming we find a movie, we simply add it to the props. To account for the case where a movie isn't found, we return just an empty object as the movie.

### Adding the New Option

Let's add our second nested route. Going to '/movies/new' should display the `MoviesNew` component.

We've already created out `MoviesNew` component - it's a simple form that dispatches the `addMovie` action on submission. Let's add that into our Route, the same way we did with our `Show` component.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import rootReducer from './reducers'
import { Provider } from 'react-redux';

import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './components/App'
import MoviesPage from './containers/MoviesPage'
import MoviesShow from './containers/MoviesShow'
...

ReactDOM.render(
  (<Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviesPage} >
          <Route path="/movies/new" component={MoviesNew} />
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```
Note that we **must** define our `/movies/new` route first. Why? Because otherwise, the `/:id` route handler would catch it first and assessing `"new"` to be the id.

Let's add a link to our Movies List to add a new movie.

```javascript
// src/components/MoviesList
import React from 'react';
import {Link} from 'react-router';
import MoviesListItem from './MoviesListItem';

export default (props) => {
  const movies = props.movies;

  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies.map( (movie) => <MoviesListItem movie={movie} key={movie.id}/>)}
        </ul>
        <Link to="/movies/new">Add a Movie</Link>
      </div>
    </div>
  )
}
```

Now, we can easily link between our new movie list and our MoviesShow component!

### Redirecting

Finally, it would be nice if after creating the new Movie, we could "redirect" the user back to the '/movies' route. Luckily, React Router gives us a nice interface to do this using `browserHistory`.

In our `MoviesNew` component, let's import `browserHistory` and use it's `push` method to change the route.

```javascript
//src/containers/MoviesNew
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addMovie} from '../actions'
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';

class MoviesNew extends Component {

  handleSubmit(e){
    e.preventDefault();
    const movie = {
      title: this.refs.movieTitle.value
    }
    this.props.addMovie(movie);
    this.refs.movieTitle.value = "";
    browserHistory.push('/movies');
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit.bind(this)} >
        <input type="text" ref="movieTitle" placeholder="Add a Movie" />
      </form>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    addMovie: bindActionCreators(addMovie, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(MoviesNew)
```

We can use `browserHistory` to update the URL in any component lifecycle method or any event handler. Now, after submitting our form, we're sent back to the index route. Awesome!


### The Index Route
Take another look at our routes file.  What you will see is that we can visit the `/movies/new` and the MoviesPage component will receive the MoviesNew component as its child.  Upon visiting `movies/3` the MoviesPage component receives the MoviesShow component as its child.  However, what if we want to allow the user to visit the `/movies` url.  Likely, we still want the parent component to display, yet we also want another component passed through as our child.  So one might be tempted to have two Routes both a parent and a child each pointing to '/movies', but that would be confusing: the parent of '/movies' is '/movies'?  Instead react router provides a separate component: IndexRoute.  The IndexRoute simply sets the path as the path in the parent route.  So to render out a MoviesIndex component when a user visits `/movies` we do the following:


```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import rootReducer from './reducers'
import { Provider } from 'react-redux';

// import IndexRoute from react-router
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

ReactDOM.render(
  (<Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviesPage} >
          <IndexRoute component={MoviesIndex}/>
          <Route path="/movies/new" component={MoviesNew} />
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```

So by making use of the IndexRoute we can specify the component that should be passed through as the child prop when the user visits the top-level of a nested route.

### Summary

So in this section we saw how upon visiting a url, React Router will supply any dynamic pieces of the URL to the related component via an object called `routeParams`.  We then saw how to access those props in our mapStateToProps function as ownProps, and how to use those props to find the related movie.

Then we saw how after taking an action like creating a new movie, we can change the url by using the browserHistory.push method.  So a call to browserHistory.push('/movies') changes the url to `/movies`.

Finally, we saw that by making use of the IndexRoute we can specify the component that should be passed through as the child prop when the user visits the top-level of a nested route.

<p class='util--hide'>View <a href='https://learn.co/lessons/react-router-params'>React Router Params</a> on Learn.co and start learning to code for free.</p>
