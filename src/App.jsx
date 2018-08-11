import React, { PureComponent, Fragment } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Nav';
import styled from 'styled-components';
import getWeb3 from './constants/web3';
import RetrieveWithPrivateKey from './components/Retrieve';
import Tx from './components/Tx';
import { Button } from 'antd';

const Wrapper = styled.div`
  text-align: center;
`;

class App extends PureComponent {
  state = {
    title: 'Welcome to Usabl',
    auth: false,
    balance: '',
    web3: null
  };

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        // Instantiate contract once web3 provided.
        // this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  updateTitle = async jsonWallet => {
    let balance = await this.state.web3.eth.getBalance(jsonWallet.address);
    this.setState(() => ({
      title: `0x${jsonWallet.address}`,
      auth: true,
      balance
    }));
  };

  setUser = async user => {
    let balance = await this.state.web3.eth.getBalance(user.jsonWallet.address);
    this.setState(() => ({
      balance,
      title: `0x${user.jsonWallet.address}`,
      auth: true
    }));
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
            <Register updateTitle={this.updateTitle} web3={this.state.web3} />
            <br />
            <br />
            <Login
              updateTitle={this.updateTitle}
              setUser={this.setUser}
              web3={this.state.web3}
            />
            <br />
            <br />
            <RetrieveWithPrivateKey
              updateTitle={this.updateTitle}
              web3={this.state.web3}
            />
          </Fragment>
        ) : (
          <Fragment>
            <br />
            <br />
            <Button type="danger" size="small" onClick={this.logout}>
              Logout
            </Button>
            <br />
            <br />
            <br />
            <br />
            <Tx web3={this.state.web3} title={this.state.title} />
          </Fragment>
        )}
      </Wrapper>
    );
  }
}

export default App;
