import React, { Component, Fragment } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Nav';
import styled from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
`;

class App extends Component {
  state = {
    title: 'Welcome to Usabl',
    auth: false
  };

  updateTitle = title => this.setState(() => ({ title, auth: true }));

  logout = () =>
    this.setState(() => ({ title: 'Welcome to Usabl', auth: false }));

  render() {
    let { auth } = this.state;
    return (
      <Wrapper>
        <Navbar title={this.state.title} />
        {!auth ? (
          <Fragment>
            <Register updateTitle={this.updateTitle} />
            <Login updateTitle={this.updateTitle} />
          </Fragment>
        ) : (
          <button onClick={this.logout}>Logout</button>
        )}
      </Wrapper>
    );
  }
}

export default App;
