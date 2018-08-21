import React, { Component, Fragment } from 'react';
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
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

const TabPane = Tabs.TabPane;

const LoggedIn = ({ logout, web3, title }) => (
  <Fragment>
    <Tabs defaultActiveKey="2">
      <TabPane tab="Logout" key="1">
        <div>
          <Button type="danger" size="small" onClick={logout}>
            Logout
          </Button>
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

class App extends Component {
  state = {
    title: 'Welcome to Usabl',
    auth: false,
    balance: '🎉',
    web3: null
  };

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
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
      balance
    }));
    this.props.history.push('/dashboard');
  };

  setUser = async user => {
    let balance = await this.state.web3.eth.getBalance(user.jsonWallet.address);
    this.setState(() => ({
      balance,
      title: `0x${user.jsonWallet.address}`,
      auth: true
    }));
    this.props.history.push('/dashboard');
  };

  logout = () =>
    this.setState(() => ({
      title: 'Welcome to Usabl',
      auth: false,
      balance: ''
    }));

  render() {
    let { auth, title, balance, redirectTo } = this.state;

    return (
      <Wrapper data-testid="mainApp">
        <Navbar title={title} balance={balance} />
        <Switch>
          <PropsRoute
            path="/"
            exact
            component={LoggedOut}
            authed={auth}
            data-testid="out"
            updateTitle={this.updateTitle}
            web3={this.state.web3}
            setUser={this.setUser}
          />
          <PrivateRoute
            authed={auth}
            path="/dashboard"
            component={LoggedIn}
            data-testid="in"
            logout={this.logout}
            web3={this.state.web3}
            title={this.state.title}
          />
        </Switch>
      </Wrapper>
    );
  }
}

export default withRouter(App);

// These hoc components allow you to pass props into a route component
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

const PrivateRoute = ({ component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        authed === true ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
