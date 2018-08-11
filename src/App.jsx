import React, { Component, Fragment } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Nav';
import TxHistory from './components/TxHistory';
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
    this.setState(() => ({
      title: jsonWallet.address,
      auth: true,
      balance
    }));
  };

  setUser = async user => {
    let balance = await web3.eth.getBalance(user.jsonWallet.address);
    this.setState({
      title: `0x${user.jsonWallet.address}`,
      auth: true,
      balance
    });
  };

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
          <div>
            <button onClick={this.logout}>Logout</button>
            <TxHistory title={title} />
          </div>
        )}
      </Wrapper>
    );
  }
}

export default App;
