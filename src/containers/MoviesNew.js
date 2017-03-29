import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMovie } from '../actions';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

class MoviesNew extends Component {

  constructor() {
    super();

    this.state = {
      title: ''
    };
  }

  handleOnSubmit(event) {
    event.preventDefault();
    this.props.addMovie(this.state);
    this.setState({
      title: ""
    })
    browserHistory.push('/movies')
  }

  handleOnChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  render(){
    return (
      <form onSubmit={(event) => this.handleOnSubmit(event)} >
        <input
          type="text"
          onChange={(event) => this.handleOnChange(event)}
          value={this.state.title}
          placeholder="Add a Movie" />
        <input type="submit" value="Add Movie" />
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMovie: bindActionCreators(addMovie, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(MoviesNew)
