import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { addEncryptedUserToFirebase } from './helpers';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { FormItems } from './helpers';
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
      <FormItems type="username" handleChange={handleChange} />

      <FormItems type="password" handleChange={handleChange} />

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

  handleSubmit = async (username, walletPassword, privateKey) => {
    let wallet = this.props.web3.eth.accounts.privateKeyToAccount(
      `0x${privateKey}`
    );

    let jsonWallet = await wallet.encrypt(walletPassword, {});

    // optimistic frontend update
    this.props.updateTitle(jsonWallet);
    try {
      addEncryptedUserToFirebase(username, walletPassword, jsonWallet);
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
