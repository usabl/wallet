import React, { Component, Fragment } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Nav';
import styled from 'styled-components';
// import { web3 } from './constants/web3';
import getWeb3 from './constants/web3';
import Counter from './build/contracts/Counter.json';
import contract from 'truffle-contract';

const Wrapper = styled.div`
  text-align: center;
`;

class App extends Component {
  state = {
    title: 'Welcome to Usabl',
    auth: false,
    balance: '',
    web3: null,
    count: null
  };

  componentWillMount() {
    // this.instantiateContract();
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        // Instantiate contract once web3 provided.
        // this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

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

  incrementCounter = async () => {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    let counter = this.setProviderAndfixTruffleContractCompatibilityIssue(
      Counter,
      this.state.web3.currentProvider
    );
    // const counter = contract(Counter);
    // counter.setProvider(this.state.web3.currentProvider);
    // Declaring this for later so we can chain functions on SimpleStorage.
    var counterInstance;

    counter
      .deployed()
      .then(instance => {
        counterInstance = instance;
        return counterInstance.increment.call({ from: this.state.title });
      })
      .then(result => {
        // Get the value from the contract to prove it worked.
        return counterInstance.get();
      })
      .then(result => {
        // Update state with the result.
        return this.setState({ count: result.c[0] });
      });
    // );
  };

  updateTitle = async jsonWallet => {
    let balance = await this.state.web3.eth.getBalance(jsonWallet.address);
    this.setState(() => ({
      title: `0x${jsonWallet.address}`,
      auth: true,
      balance
    }));
  };

  setUser = async user => {
    let balance = await this.state.web3.eth.getBalance(user.jsonWallet.address);
    this.setState(() => ({
      balance,
      title: `0x${user.jsonWallet.address}`,
      auth: true
    }));
  };

  retieveUser = async user => {
    let balance = await this.state.web3.eth.getBalance(user.address);
    this.setState(() => ({
      balance,
      title: user.address,
      auth: true
    }));
  };

  logout = () =>
    this.setState(() => ({ title: 'Welcome to Usabl', auth: false }));

  render() {
    let { auth, title, balance } = this.state;
    return (
      <Wrapper>
        <Navbar title={title} balance={balance} />
        {!auth ? (
          <Fragment>
            <Register updateTitle={this.updateTitle} web3={this.state.web3} />
            <Login
              updateTitle={this.updateTitle}
              setUser={this.setUser}
              web3={this.state.web3}
              retieveUser={this.retieveUser}
            />
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={this.logout}>Logout</button>
            <button onClick={() => this.incrementCounter()}>Some Tx</button>
            <span>{this.state.count}</span>
          </Fragment>
        )}
      </Wrapper>
    );
  }
}

export default App;
