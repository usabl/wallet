import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { addEncryptedUserToFirebase, findUsernameOnFirebase } from './helpers';
import styled from 'styled-components';
import { Form, Input, Button, notification } from 'antd';
import { FormItems } from './helpers';
const FormItem = Form.Item;

const PrivateKeyForm = ({
  username,
  password,
  privateKey,
  handleSubmit,
  handleChange,
  loading
}) => (
  <Form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(username, password, privateKey);
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

class RetrieveWithPrivateKey extends PureComponent {
  static propTypes = {
    retieveUser: PropTypes.func,
    web3: PropTypes.object
  };

  state = {
    username: '',
    password: '',
    privateKey: '',
    loading: false
  };

  handleSubmit = async (username, password, privateKey) => {
    this.setState({ loading: true });

    let isUnique = await findUsernameOnFirebase(username);
    if (isUnique) {
      let wallet = this.props.web3.eth.accounts.privateKeyToAccount(
        `0x${privateKey}`
      );

      let jsonWallet = await wallet.encrypt(password, {});

      // optimistic frontend update
      this.props.updateTitle(jsonWallet);
      try {
        addEncryptedUserToFirebase(username, password, jsonWallet);
      } catch (err) {
        this.setState({ loading: false });
        // revert frontend update if something fails here
        console.log('err', err);
      }
    } else {
      this.setState({ loading: false });
      notification['warning']({
        message: 'Pick another Pirate name, yer scallywag!!',
        description: `Looks like one of our trecherous crew has already claimed that name for their ownsome.`
      });
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <div>
        <h2>Retrieve</h2>
        <PrivateKeyForm
          username={this.state.username}
          password={this.state.password}
          privateKey={this.state.privateKey}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default RetrieveWithPrivateKey;
