import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import CryptoJS from 'crypto-js';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

class ComponentName extends PureComponent {
  static propTypes = {};

  state = {
    username: '',
    walletPassword: '',
    title: 'Welcome to Usabl'
  };

  handleSubmit = async (username, walletPassword) => {
    try {
      let wallet = web3.eth.accounts.create();
      // can add entropy .create([entropy])
      let jsonWallet = await wallet.encrypt(walletPassword, {});
      // let backendPassword = CryptoJS.HmacSHA256(
      //   username,
      //   walletPassword
      // ).toString();

      // localStorage.setItem(
      //   'wallet_data',
      //   JSON.stringify({ [username]: backendPassword })
      // );
      // console.log('jsonWallet', jsonWallet);
      // console.log('wallet_public_key', wallet.mnemonic);

      this.props.updateTitle(jsonWallet.address);
    } catch (err) {
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit(this.state.username, this.state.walletPassword);
        }}
      >
        <h2>Register</h2>
        <input
          placeholder="username"
          onChange={e => this.handleChange('username', e.target.value)}
        />
        <input
          placeholder="password"
          onChange={e => this.handleChange('walletPassword', e.target.value)}
        />
        <input type="submit" />
      </form>
    );
  }
}

export default ComponentName;
