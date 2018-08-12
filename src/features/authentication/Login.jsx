import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../../constants/firebase';
import styled from 'styled-components';
import { Button } from 'antd';
import { FormItems } from './helpers';
import { Form } from 'antd';

const LoginForm = ({
  username,
  walletPassword,
  handleSubmit,
  handleChange
}) => (
  <Form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(username, walletPassword);
    }}
  >
    <Container>
      <FormItems type="username" handleChange={handleChange} />
      <FormItems type="password" handleChange={handleChange} />
    </Container>

    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form>
);

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
      <Fragment>
        <h2>Login</h2>
        <LoginForm
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          username={this.state.username}
          walletPassword={this.state.walletPassword}
        />
      </Fragment>
    );
  }
}

export default Login;
