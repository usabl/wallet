import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { web3 } from '../constants/web3';
import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../constants/firebase';

class Login extends Component {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired
  };

  state = {
    username: '',
    walletPassword: '',
    privateKey:
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  };

  retrieveAccount = privateKey => {
    let user = this.props.web3.eth.accounts.privateKeyToAccount(
      `0x${privateKey}`
    );
    this.props.retieveUser(user);
  };

  findUserOnFirebase = async (username, password) =>
    await db
      .collection('users')
      .where('username', '==', username)
      .where('password', '==', password)
      .get()
      .then(collection => collection.docs.map(doc => doc.data()))
      .then(users => users[0]);

  handleSubmit = async (username, walletPassword) => {
    try {
      let backendPassword = encrypt(username, walletPassword).toString();
      let user = await this.findUserOnFirebase(username, backendPassword);

      this.props.setUser(user);
    } catch (err) {
      // revert frontend update if something fails here
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
        <br />
        <br />
        <h2>Retrieve</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.retrieveAccount(this.state.privateKey);
          }}
        >
          <input
            type="text"
            placeholder="privateKey"
            value={this.state.privateKey}
            onChange={e => this.handleChange('privateKey', e.target.value)}
          />

          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default Login;
