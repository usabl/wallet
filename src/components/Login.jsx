import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { web3 } from '../constants/web3';
import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../constants/firebase';

class Login extends Component {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired
  };

  state = {
    username: '',
    walletPassword: ''
  };

  setUser;

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
      console.log('ss', user);

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
      </div>
    );
  }
}

export default Login;
