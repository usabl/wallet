import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ethers from 'ethers';
import CryptoJS from 'crypto-js';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

class App extends Component {
  state = {
    username: '',
    walletPassword: ''
  };

  handleSubmit = async (username, walletPassword) => {
    try {
      let wallet = web3.eth.accounts.create();
      // can add entropy .create([entropy])
      let jsonWallet = await wallet.encrypt(walletPassword, {});
      let backendPassword = CryptoJS.HmacSHA256(
        username,
        walletPassword
      ).toString();

      // sessionStorage['username'] = username;
      // sessionStorage['jsonWallet'] = jsonWallet;

      console.log('jsonWallet', jsonWallet);
      console.log('wallet_public_key', wallet.mnemonic);
    } catch (err) {
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.handleSubmit(this.state.username, this.state.walletPassword);
          }}
        >
          <input
            type="text"
            placeholder="username"
            onChange={e => this.handleChange('username', e.target.value)}
          />
          <input
            type="text"
            placeholder="password"
            onChange={e => this.handleChange('walletPassword', e.target.value)}
          />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
