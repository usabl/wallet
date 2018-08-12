import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { addEncryptedUserToFirebase, findUsernameOnFirebase } from './helpers';
import { Form, Button, notification } from 'antd';
import { FormItems } from './helpers';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  flex-direction: column;
`;

class Tx extends PureComponent {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
    title: 'Welcome to Usabl',
    loading: false,
  };

  checkIfUserExists = user => {};

  handleSubmit = async (username, password) => {
    this.setState({ loading: true });

    let isUnique = await findUsernameOnFirebase(username);
    if (isUnique) {
      let wallet = this.props.web3.eth.accounts.create();
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
        description: `Looks like one of our trecherous crew has already claimed that name for their ownsome.`,
      });
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  render() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit(this.state.username, this.state.password);
        }}
      >
        <h2>Register</h2>
        <Container>
          <FormItems type="username" handleChange={this.handleChange} />
          <FormItems type="password" handleChange={this.handleChange} />
        </Container>
        <Button type="primary" htmlType="submit" loading={this.state.loading}>
          Submit
        </Button>
      </Form>
    );
  }
}

export default Tx;
