import React, { Component } from "react";
import logo from "./holochain_logo.png";
import "./App.css";
import ButtonController from "./components/ButtonController";
import Game from "./components/Game";
import RegisterModal from "./components/RegisterModal";
import "./components/Header";
import {connect} from 'react-redux';

import {
  register,
  getState,
  getVotesAfterVote,
  getPlayers,
  getTeam,
} from './actions'


class App extends Component {

  componentWillMount() {
    setInterval(this.props.getState, 500);
    setInterval(this.props.getPlayers, 5000);
    setInterval(
      () => {
        console.log('latestVote', this.props.viz.latestVote)
        this.props.getVotesAfterVote(this.props.viz.latestVote)
      },
      500
    );
  }

  render() {
    const game = <Game ballX={10} ballY={20} leftPaddleY={30} rightPaddleY={40} />
    const buttons = <ButtonController />
    const isRegistered = !!this.props.team

    return (
      <div className="App">
        <div class="App-header-wrapper">
          <div class="left"></div>
          <header className="App-header">
            <h1 className="App-title">PANOPTIPONG</h1>
          </header>
        </div>
        <div className="game-and-controls">
          { !isRegistered
            ? [game]
            : this.props.team === 'L'
            ? [buttons, game]
            : [game, buttons]
          }
        </div>

        { isRegistered ? null : <RegisterModal/> }
      </div>
    );
  }
}

const mapStateToProps = ({team, viz}) => ({team, viz})

const mapDispatchToProps = dispatch => {
  return {
    getState: () => dispatch(getState()),
    getPlayers: () => dispatch(getPlayers()),
    getVotesAfterVote: () => dispatch(getVotesAfterVote()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
