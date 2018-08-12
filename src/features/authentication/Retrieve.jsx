import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../constants/firebase';
import { encryptBackendPassword, addUserToFirebase } from './helpers';
import styled from 'styled-components';
import { Input, Button } from 'antd';
import { Form } from 'antd';
const FormItem = Form.Item;

const PrivateKeyForm = ({
  username,
  walletPassword,
  privateKey,
  handleSubmit,
  handleChange
}) => (
  <Form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(username, walletPassword, privateKey);
    }}
  >
    <Container>
      <FormItem>
        <Input
          type="text"
          placeholder="username"
          onChange={e => handleChange('username', e.target.value)}
        />
      </FormItem>
      <FormItem>
        <Input
          type="password"
          placeholder="password"
          onChange={e => handleChange('walletPassword', e.target.value)}
        />
      </FormItem>
      <FormItem>
        <Input
          type="text"
          placeholder="privateKey"
          value={privateKey}
          onChange={e => handleChange('privateKey', e.target.value)}
        />
      </FormItem>
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

class RetrieveWithPrivateKey extends PureComponent {
  static propTypes = {
    retieveUser: PropTypes.func.isRequired,
    web3: PropTypes.object
  };

  state = {
    username: '',
    walletPassword: '',
    privateKey:
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418'
  };

  addUserToFirebase = (username, password, jsonWallet) => {
    let user = { username, password, jsonWallet };
    db.collection('users').add(user);
  };

  handleSubmit = async (username, walletPassword, privateKey) => {
    let wallet = this.props.web3.eth.accounts.privateKeyToAccount(
      `0x${privateKey}`
    );

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
      <div>
        <h2>Retrieve</h2>
        <PrivateKeyForm
          username={this.state.username}
          walletPassword={this.state.walletPassword}
          privateKey={this.state.privateKey}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

export default RetrieveWithPrivateKey;
