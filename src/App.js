import React, { Component } from 'react';
import './App.css';
import ethers from 'ethers';
import CryptoJS from 'crypto-js';
import styled from 'styled-components';
import { TextInputField } from 'evergreen-ui';
import Login from './components/Login.js';
import Navbar from './components/Nav';

class App extends Component {
  state = {
    username: '',
    walletPassword: '',
    title: 'Welcome to Usabl'
  };

  handleSubmit = async (username, walletPassword) => {
    try {
      let wallet = ethers.Wallet.createRandom();
      let jsonWallet = await wallet.encrypt(walletPassword, {});
      let backendPassword = CryptoJS.HmacSHA256(
        username,
        walletPassword
      ).toString();

      localStorage.setItem(
        'wallet_data',
        JSON.stringify({ [username]: backendPassword })
      );
      console.log('jsonWallet', jsonWallet);
    } catch (err) {
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <div className="App">
        <Navbar title={this.state.title} />
        <form
          onSubmit={e => {
            e.preventDefault();
            this.handleSubmit(this.state.username, this.state.walletPassword);
          }}
        >
          <TextInputField
            inputWidth="250px"
            label="Username"
            placeholder="username"
            onChange={e => this.handleChange('username', e.target.value)}
          />
          <TextInputField
            inputWidth="250px"
            label="Password"
            placeholder="password"
            onChange={e => this.handleChange('walletPassword', e.target.value)}
          />
          <input type="submit" />
        </form>
        <Login />
      </div>
    );
  }
}

export default App;
