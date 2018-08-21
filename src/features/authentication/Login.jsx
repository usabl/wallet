import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import encrypt from 'crypto-js/hmac-sha256';
import styled from 'styled-components';
import { Button, notification } from 'antd';
import { FormItems, findUserOnFirebase } from './helpers';
import { Form } from 'antd';

const LoginForm = ({
  username,
  password,
  handleSubmit,
  handleChange,
  loading,
  history
}) => (
  <Form
    onSubmit={async e => {
      e.preventDefault();
      await handleSubmit(username, password);
    }}
  >
    <Container>
      <FormItems type="username" handleChange={handleChange} />
      <FormItems type="password" handleChange={handleChange} />
    </Container>

    <Button type="primary" htmlType="submit" loading={loading}>
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
    password: '',
    loading: false
  };

  handleSubmit = async (username, password) => {
    this.setState({ loading: true });
    try {
      let backendPassword = encrypt(username, password).toString();
      let user = await findUserOnFirebase(username, backendPassword);
      if (user) {
        this.props.setUser(user);
      } else {
        notification['error']({
          message: 'Aaarrgh, No Pirates by that name here, matey!',
          description: `You'll be wanting to climbin aboard I suppose? Head to the Register page for adventure and treasures. `
        });
      }
    } catch (err) {
      // revert frontend update if something fails here
      this.setState({ loading: false });
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
          password={this.state.password}
          loading={this.state.loading}
        />
      </Fragment>
    );
  }
}

export default Login;
