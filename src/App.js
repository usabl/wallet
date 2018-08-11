import React, { Component } from 'react';
import './App.css';
import ethers from 'ethers';
import CryptoJS from 'crypto-js';
import styled from 'styled-components';
import { TextInputField } from 'evergreen-ui';

class App extends Component {
  state = {
    username: '',
    walletPassword: '',
    title: 'Welcome to React'
  };

  handleSubmit = async (username, walletPassword) => {
    try {
      let wallet = ethers.Wallet.createRandom();
      let jsonWallet = await wallet.encrypt(walletPassword, {});
      let backendPassword = CryptoJS.HmacSHA256(
        username,
        walletPassword
      ).toString();
      console.log('jsonWallet', typeof jsonWallet);
      this.setState(() => ({ title: jsonWallet }));
    } catch (err) {
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>
        </header>

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
      </div>
    );
  }
}

export default App;
