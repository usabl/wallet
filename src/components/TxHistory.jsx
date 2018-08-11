import React, { Component } from 'react';
import styled from 'styled-components';
import { web3 } from '../constants/web3';

class TxHistory extends Component {
  state = {
    result: []
  };
  async componentDidMount() {
    // console.log(this.props.title);
    // this.updateTitle(this.props.title);

    var myAddr = this.props.title;

    let fetchdata = await fetch(
      `http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${myAddr}`
    );

    let txlist = await fetchdata.json();
    // console.log('kk', txlist);
    this.setState({ result: txlist.result });

    // console.log(txlist.result[0].hash);
    // for (var i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
    //   console.log();
    //   try {
    //     var block = await web3.eth.getBlock(i, true);
    //     console.log('block', block);
    //     if (block && block.transactions) {
    //       await block.transactions.forEach(function(e) {
    //         if (myAddr === e.from) {
    //           if (e.from !== e.to) bal = bal.plus(e.value);
    //           console.log(i, e.from, e.to, e.value.toString(10));
    //           --n;
    //         }
    //         if (myAddr === e.to) {
    //           if (e.from !== e.to) bal = bal.minus(e.value);
    //           console.log(i, e.from, e.to, e.value.toString(10));
    //         }
    //       });
    //     }
    //   } catch (e) {
    //     console.error('Error in block ' + i, e);
    //   }
    // }
  }
  updateTitle = async account => {
    let balance = await web3.eth.getBalance(account);
    console.log(balance);
  };

  getThing = async () => {};

  render() {
    let { result } = this.state;
    console.log('pig', result);
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
