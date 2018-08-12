import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { db } from '../../constants/firebase';
import Counter from '../../build/contracts/Counter.json';
import { Input, notification } from 'antd';
import { Slider } from 'antd';
import styled from 'styled-components';
import {
  setProviderAndfixTruffleContractCompatibilityIssue,
  matchPasswords
} from './helpers';

const TxModal = ({
  visible,
  handleOk,
  handleCancel,
  handleChange,
  passwordConfirm,
  gas,
  showAdvanced,
  onChange
}) => {
  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="Advanced Settings"
    >
      <Input
        danger
        placeholder="Enter your password to proceed..."
        onChange={e => handleChange('passwordConfirm', e.target.value)}
        value={passwordConfirm}
      />

      <p>
        This transaction will cost you $ 0.
        {gas}
      </p>
      {showAdvanced && (
        <Fragment>
          <Slider defaultValue={gas} onChange={onChange} />

          <Descriptors>
            <p>Cheap</p> <p>Fast</p>
          </Descriptors>
        </Fragment>
      )}
    </Modal>
  );
};

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
    this.incrementCounter(this.state.passwordConfirm);
    this.setState({
      visible: false,
      passwordConfirm: ''
    });
  };

  handleCancel = () =>
    this.setState({
      showAdvanced: true
    });

  handleChange = (field, value) => this.setState({ [field]: value });

  onChange = value => this.setState({ gas: value });

  incrementCounter = async passwordConfirm => {
    let username = await db
      .collection('users')
      .where(`jsonWallet.address`, `==`, this.props.title.substring(2))
      .get()
      .then(collection => collection.docs.map(doc => doc.data().username))
      .then(users => users[0]);

    console.log('b', username, passwordConfirm);

    let worthy = await matchPasswords(username, passwordConfirm);

    if (worthy) {
      let counter = setProviderAndfixTruffleContractCompatibilityIssue(
        Counter,
        this.props.web3.currentProvider
      );

      /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

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
      notification['error']({
        message: 'Thou shalt not pass.',
        description:
          'You be bad. YOU STOP, I see you ok. Dont make password thief, you go now, no crypto!'
      });
      return;
    }
  };

  render() {
    return (
      <Fragment>
        <Button type="primary" size="large" onClick={this.showModal}>
          Do Thing
        </Button>
        <TxModal
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleChange={this.handleChange}
          passwordConfirm={this.state.passwordConfirm}
          gas={this.state.gas}
          showAdvanced={this.state.showAdvanced}
          onChange={this.onChange}
        />
        <span>{this.state.count}</span>
      </Fragment>
    );
  }
}

export default Dialogue;
