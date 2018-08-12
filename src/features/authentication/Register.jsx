import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import { Form } from 'antd';
import { encryptBackendPassword, addUserToFirebase } from './helpers';
const FormItem = Form.Item;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  flex-direction: column;
`;

class ComponentName extends PureComponent {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired
  };

  state = {
    username: '',
    walletPassword: '',
    title: 'Welcome to Usabl'
  };

  // addUser: function(username, password, jsonWallet, success, error) {
  //     let existingUser = this.users.filter(
  //         u => u.username === username)[0];
  //     if (!existingUser) {
  //         let user = {username, password, jsonWallet};
  //         this.users.push(user);
  //         success(user);
  //     }
  //     else
  //         error("Username unavailable: " + username);
  // }

  handleSubmit = async (username, walletPassword) => {
    let wallet = this.props.web3.eth.accounts.create();

    let jsonWallet = await wallet.encrypt(walletPassword, {});

    // optimistic frontend update
    this.props.updateTitle(jsonWallet);
    try {
      let backendPassword = encryptBackendPassword(username, walletPassword);
      addUserToFirebase(username, backendPassword, jsonWallet);
    } catch (err) {
      // revert frontend update if something fails here
      console.log('err', err);
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit(this.state.username, this.state.walletPassword);
        }}
      >
        <h2>Register</h2>
        <Container>
          <FormItem>
            <Input
              placeholder="username"
              onChange={e => this.handleChange('username', e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              placeholder="password"
              onChange={e =>
                this.handleChange('walletPassword', e.target.value)
              }
            />
          </FormItem>
        </Container>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default ComponentName;
