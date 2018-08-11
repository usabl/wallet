import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { db } from '../constants/firebase';
import Counter from '../build/contracts/Counter.json';
import contract from 'truffle-contract';
import encrypt from 'crypto-js/hmac-sha256';
import { Input, notification } from 'antd';
import { Slider } from 'antd';
import styled from 'styled-components';

const Descriptors = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

class Dialogue extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    web3: PropTypes.object
  };

  state = {
    visible: false,
    count: null,
    showAdvanced: false,
    gas: 30,
    passwordConfirm: ''
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.incrementCounter();
    this.setState({
      visible: false,
      passwordConfirm: ''
    });
  };

  handleCancel = () =>
    this.setState({
      showAdvanced: true
    });

  // Workaround for a compatibility issue between web3@1.0.0-beta.29 and truffle-contract@3.0.3
  // https://github.com/trufflesuite/truffle-contract/issues/57#issuecomment-331300494
  fixTruffleContractCompatibilityIssue = contract => {
    if (typeof contract.currentProvider.sendAsync !== 'function') {
      contract.currentProvider.sendAsync = function() {
        return contract.currentProvider.send.apply(
          contract.currentProvider,
          arguments
        );
      };
    }
    return contract;
  };

  setProviderAndfixTruffleContractCompatibilityIssue = (
    _contract,
    currentProvider
  ) => {
    const x = contract(_contract);
    x.setProvider(currentProvider);
    return this.fixTruffleContractCompatibilityIssue(x);
  };

  matchPasswords = async (username, password) => {
    let backendPassword = encrypt(username, password).toString();
    let passwordToMatch = await db
      .collection('users')
      .where(`username`, `==`, username)
      .get()
      .then(collection => collection.docs.map(doc => doc.data().password))
      .then(users => users[0]);

    if (backendPassword === passwordToMatch) {
      return true;
    } else {
      return false;
    }
  };

  incrementCounter = async () => {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    let username = await db
      .collection('users')
      .where(`jsonWallet.address`, `==`, this.props.title.substring(2))
      .get()
      .then(collection => collection.docs.map(doc => doc.data().username))
      .then(users => users[0]);

    let worthy = await this.matchPasswords(
      username,
      this.state.passwordConfirm
    );

    if (worthy) {
      let counter = this.setProviderAndfixTruffleContractCompatibilityIssue(
        Counter,
        this.props.web3.currentProvider
      );
      var counterInstance;
      counter
        .deployed()
        .then(instance => {
          counterInstance = instance;
          return counterInstance.increment.call({
            from: this.props.title,
            gas: 1000000
          });
        })
        .then(result => {
          // Get the value from the contract to prove it worked.
          return counterInstance.get();
        })
        .then(result => {
          // Update state with the result.
          return this.setState({ count: result.c[0] });
        });
    } else {
      console.log('thou shalt not pass');
      notification['error']({
        message: 'Thou shalt not pass.',
        description:
          'You be bad. YOU STOP, I see you ok. Dont make password thief, you go now, no crypto!'
      });

      return;
    }
  };

  handleChange = (field, value) => this.setState({ [field]: value });

  onChange = value => this.setState({ gas: value });

  render() {
    return (
      <div>
        <Button type="primary" size="large" onClick={this.showModal}>
          Do Thing
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="Advanced Settings"
        >
          <Input
            danger
            placeholder="Enter your password to proceed..."
            onChange={e => this.handleChange('passwordConfirm', e.target.value)}
            value={this.state.passwordConfirm}
          />
          <br />
          <br />
          <p>
            This transaction will cost you $ 0.
            {this.state.gas}
          </p>
          {this.state.showAdvanced && (
            <div>
              <br />
              <br />
              <Slider defaultValue={this.state.gas} onChange={this.onChange} />

              <Descriptors>
                <p>Cheap</p> <p>Fast</p>
              </Descriptors>
            </div>
          )}
        </Modal>
        <span>{this.state.count}</span>
      </div>
    );
  }
}

export default Dialogue;
