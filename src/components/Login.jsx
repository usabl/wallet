import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../constants/firebase';
import styled from 'styled-components';
import { Input, Button } from 'antd';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  flex-direction: column;
`;

class Login extends PureComponent {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
  };

  state = {
    username: '',
    walletPassword: ''
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
          <Container>
            <Input
              type="text"
              placeholder="username"
              onChange={e => this.handleChange('username', e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              onChange={e =>
                this.handleChange('walletPassword', e.target.value)
              }
            />
          </Container>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;
