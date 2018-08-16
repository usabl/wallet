import React, { PureComponent, Fragment } from 'react';
import Login from './features/authentication/Login';
import Register from './features/authentication/Register';
import RetrieveWithPrivateKey from './features/authentication/Retrieve';
import Navbar from './components/Nav';
import TxHistory from './components/TxHistory';
import styled from 'styled-components';
import getWeb3 from './constants/web3';
import Tx from './features/transactions/Tx';
import { Button } from 'antd';
import { Tabs } from 'antd';
import SecondFactor from './features/authentication/SecondFactorAuth';

const TabPane = Tabs.TabPane;

const LoggedIn = ({ logout, web3, title, username }) => (
  <Fragment>
    <Tabs defaultActiveKey="2">
      <TabPane tab="Logout" key="1">
        <div>
          <Button type="danger" size="small" onClick={logout}>
            Logout
          </Button>
          <SecondFactor username={username} />
        </div>
      </TabPane>
      <TabPane tab="Click" key="2">
        <Tx web3={web3} title={title} />
      </TabPane>
      <TabPane tab="History" key="3">
        <TxHistory title={title} />
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
    username: ''
  };

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
        });
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
      username: user.username
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
      <Wrapper data-testId="mainApp">
        <Navbar title={title} balance={balance} />
        {!auth ? (
          <LoggedOut
            data-testId="out"
            updateTitle={this.updateTitle}
            web3={this.state.web3}
            setUser={this.setUser}
          />
        ) : (
          <LoggedIn
            data-testId="in"
            logout={this.logout}
            web3={this.state.web3}
            title={this.state.title}
            username={this.state.username}
          />
        )}
      </Wrapper>
    );
  }
}

export default App;
