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
  onChange,
  loading,
  closeModal,
  min,
  max,
  actualPrice
}) => {
  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={handleOk}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Advanced Settings
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>
      ]}
    >
      <Input
        placeholder="Enter your password to proceed..."
        onChange={e => handleChange('passwordConfirm', e.target.value)}
        value={passwordConfirm}
      />

      <p>{`This will cost roughly $${actualPrice}`}</p>
      {showAdvanced && (
        <Fragment>
          <Slider min={min} max={max} defaultValue={gas} onChange={onChange} />
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
    web3: PropTypes.object,
    loading: false
  };

  state = {
    visible: false,
    count: null,
    showAdvanced: false,
    gas: 2000000,
    gasprices: ['', '', '', ''],
    passwordConfirm: '',
    actualPrice: 0
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  closeModal = () =>
    this.setState({
      visible: false
    });

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

  onChange = value =>
    this.setState(prevState => ({
      gas: value,
      actualPrice: value * 0.0001 * prevState.ethusd
    }));

  incrementCounter = async passwordConfirm => {
    this.setState({ loading: true });
    let username = await db
      .collection('users')
      .where(`jsonWallet.address`, `==`, this.props.title.substring(2))
      .get()
      .then(collection => collection.docs.map(doc => doc.data().username))
      .then(users => users[0]);

    console.log('1', username, passwordConfirm);

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
            gas: this.state.gas
          });
        })
        .then(result => {
          // Get the value from the contract to prove it worked.
          return counterInstance.get();
        })
        .then(result => {
          // Update state with the result.
          return this.setState({ count: result.c[0], loading: false });
        });
    } else {
      this.setState({ loading: false });
      notification['error']({
        message: 'Thou shalt not pass.',
        description:
          'You be bad. YOU STOP, I see you ok. Dont make password thief, you go now, no crypto!'
      });
      return;
    }
  };

  async componentDidMount() {
    let gasprice = await fetch(
      'https://www.etherchain.org/api/gasPriceOracle'
    ).then(blob => blob.json());
    // console.log('g', gasprice);

    let gasprices = Object.values(gasprice).map(val => Number(val));

    // .map(gas => this.props.web3.utils.fromWei(gas));

    // Mor comprehensive api but CORB issue. May fix in the futur https://ethgasstation.info/json/ethgasAPI.json

    let price = await fetch(
      'https://api.coinmarketcap.com/v2/ticker/1027/?convert=USD'
    ).then(blob => blob.json());
    let ethusd = price.data.quotes.USD.price;

    // let conveth = await this.props.web3.utils.fromWei(
    //   parseInt(this.state.gasprice.safeLow, 10),
    //   'ether'
    // );

    this.setState({ gasprices, ethusd });
  }

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
          closeModal={this.closeModal}
          loading={this.state.loading}
          min={this.state.gasprices[0]}
          max={this.state.gasprices[3]}
          actualPrice={this.state.actualPrice}
        />
        <span>{this.state.count}</span>
      </Fragment>
    );
  }
}

export default Dialogue;
