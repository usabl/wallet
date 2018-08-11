import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { db } from '../constants/firebase';
import encrypt from 'crypto-js/hmac-sha256';
import styled from 'styled-components';
import { Input, Button } from 'antd';

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
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
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
      let backendPassword = encrypt(username, walletPassword).toString();
      this.addUserToFirebase(username, backendPassword, jsonWallet);
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
        <form
          onSubmit={e => {
            e.preventDefault();
            this.handleSubmit(
              this.state.username,
              this.state.walletPassword,
              this.state.privateKey
            );
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
            <Input
              type="text"
              placeholder="privateKey"
              value={this.state.privateKey}
              onChange={e => this.handleChange('privateKey', e.target.value)}
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

export default RetrieveWithPrivateKey;
