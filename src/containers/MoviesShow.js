import React, { Component } from 'react'
import { connect } from 'react-redux'

class MoviesShow extends Component {
  render(){
    const movie = this.props.movie
    return(
      <div className="col-md-8">
        {movie.title}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  // eslint-disable-next-line
  const movie = state.movies.find((movie) => movie.id == ownProps.routeParams.id)

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

export default connect(mapStateToProps)(MoviesShow)
