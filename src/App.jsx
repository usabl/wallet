import React, { PureComponent, Fragment } from 'react';
import Login from './features/authentication/Login';
import Register from './features/authentication/Register';
import RetrieveWithPrivateKey from './features/authentication/Retrieve';
import Navbar from './components/Nav';
import styled from 'styled-components';
import getWeb3 from './constants/web3';
import Tx from './features/transactions/Tx';
import { Button } from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

const LoggedIn = ({ logout, web3, title }) => (
  <Fragment>
    <Tabs defaultActiveKey="2">
      <TabPane tab="Logout" key="1">
        <Button type="danger" size="small" onClick={logout}>
          Logout
        </Button>
      </TabPane>
      <TabPane tab="Click" key="2">
        <Tx web3={web3} title={title} />
      </TabPane>
      <TabPane tab="History" key="3">
        I'm a table
      </TabPane>
    </Tabs>
  </Fragment>
);

const LoggedOut = ({ updateTitle, web3, setUser }) => (
  <Fragment>
    <Tabs defaultActiveKey="2">
      <TabPane tab="Register" key="1">
        <Register updateTitle={updateTitle} web3={web3} />
      </TabPane>
      <TabPane tab="Login" key="2">
        <Login updateTitle={updateTitle} setUser={setUser} web3={web3} />
      </TabPane>
      <TabPane tab="Forgot?" key="3">
        <RetrieveWithPrivateKey updateTitle={updateTitle} web3={web3} />
      </TabPane>
    </Tabs>
  </Fragment>
);

const Wrapper = styled.div`
  text-align: center;
`;

class App extends PureComponent {
  state = {
    title: 'Welcome to Usabl',
    auth: false,
    balance: '🎉',
    web3: null,
  };

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
        });
        // Instantiate contract once web3 provided.
        // this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  updateTitle = async jsonWallet => {
    let balance = await this.state.web3.eth.getBalance(jsonWallet.address);
    this.setState(() => ({
      title: `0x${jsonWallet.address}`,
      auth: true,
      balance,
    }));
  };

  setUser = async user => {
    let balance = await this.state.web3.eth.getBalance(user.jsonWallet.address);
    this.setState(() => ({
      balance,
      title: `0x${user.jsonWallet.address}`,
      auth: true,
    }));
  };

  logout = () =>
    this.setState(() => ({
      title: 'Welcome to Usabl',
      auth: false,
      balance: '',
    }));

  render() {
    let { auth, title, balance } = this.state;
    return (
      <Wrapper>
        <Navbar title={title} balance={balance} />
        {!auth ? (
          <LoggedOut updateTitle={this.updateTitle} web3={this.state.web3} setUser={this.setUser} />
        ) : (
          <LoggedIn logout={this.logout} web3={this.state.web3} title={this.state.title} />
        )}
      </Wrapper>
    );
  }
}

export default App;
