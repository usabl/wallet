import React, { Component } from 'react';
import styled from 'styled-components';
import getWeb3 from '../constants/web3';

class TxHistory extends Component {
  state = {
    result: []
  };
  async componentDidMount() {
    var myAddr = this.props.title;

    let fetchdata = await fetch(
      `http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${myAddr}`
    );

    let txlist = await fetchdata.json();

    this.setState({ result: txlist.result });
  }
  updateTitle = async account => {
    let balance = await getWeb3.eth.getBalance(account);
    console.log(balance);
  };

  getThing = async () => {};

  render() {
    let { result } = this.state;

    return (
      <div>
        <h1>Account History </h1>
        <ul>
          {result &&
            result.map(value => (
              <li>
                {value.to}
                {value.hash}
                {value.value}
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default TxHistory;
