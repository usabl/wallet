import React, { Component } from 'react';
// import CryptoJS from 'crypto-js';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

class Login extends Component {
  state = {
    username: '',
    walletPassword: ''
  };

  handleSubmit = async (username, walletPassword) => {
    try {
      // let wallet = ethers.Wallet.createRandom();
      let wallet = web3.eth.accounts.create();
      let jsonWallet = await wallet.encrypt(walletPassword, {});
      // let backendPassword = CryptoJS.HmacSHA256(
      //   username,
      //   walletPassword
      // ).toString();
      // let data = JSON.parse(localStorage.getItem('wallet_data'));
      // if (data[username] === backendPassword) {
      //   console.log('Yayy success');
      // } else {
      //   console.log('jsonWallet', jsonWallet);
      //   console.log('backPass', backendPassword);
      // }
      this.props.updateTitle(jsonWallet.address);
    } catch (err) {
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <div className="Login">
        <h2>Login</h2>
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

export default Login;
