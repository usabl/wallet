import speakeasy from 'speakeasy';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import { Form } from 'antd';
import { addSecretToUserDb, getUserId, getSecret } from './helpers';

class SecondFactor extends Component {
  state = {
    qr: ''
  };
  async componentDidMount() {
    let userId = await getUserId(this.props.username);
    let mySecret = await getSecret(userId);

    if (mySecret) {
      this.setState({ qr: mySecret });
    } else {
      let secret = speakeasy.generateSecret({ length: 20 });
      let qr = secret.base32;
      // Save this value to state and then your DB for the user
      this.setState({ qr }, () => addSecretToUserDb(this.props.username, qr));
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    var verified = speakeasy.totp.verify({
      secret: this.state.qr,
      encoding: 'base32',
      token: this.state.code
    });
  };

  render() {
    const { code } = this.state;
    return (
      <div>
        Lets set up 2FA. Please scan this code on your app and fill in the code.
        <QRCode value={this.state.qr} />
        <Form value={code} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default SecondFactor;
