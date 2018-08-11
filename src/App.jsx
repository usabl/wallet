import React, { Component, Fragment } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Nav';
import styled from 'styled-components';
import { web3 } from './constants/web3';

const Wrapper = styled.div`
  text-align: center;
`;

class App extends Component {
  state = {
    title: 'Welcome to Usabl',
    auth: false,
    balance: ''
  };

  updateTitle = async jsonWallet => {
    let balance = await web3.eth.getBalance(jsonWallet.address);
    console.log(balance);

    this.setState(() => ({
      title: jsonWallet.address,
      auth: true,
      balance
    }));
  };

  setUser = user =>
    this.setState({
      title: user.jsonWallet.address,
      auth: true
    });

  logout = () =>
    this.setState(() => ({ title: 'Welcome to Usabl', auth: false }));

  render() {
    let { auth, title, balance } = this.state;
    return (
      <Wrapper>
        <Navbar title={title} balance={balance} />
        {!auth ? (
          <Fragment>
            <Register updateTitle={this.updateTitle} />
            <Login updateTitle={this.updateTitle} setUser={this.setUser} />
          </Fragment>
        ) : (
          <button onClick={this.logout}>Logout</button>
        )}
      </Wrapper>
    );
  }
}

export default App;
