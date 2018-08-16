import speakeasy from 'speakeasy';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import qrcode from 'qrcode';
import { Input } from 'antd';
import { addSecretToUserDb, getUserId, getSecret } from './helpers';

class SecondFactor extends Component {
  state = {
    qr: '',
    newuser: ''
  };
  async componentDidMount() {
    let userId = await getUserId(this.props.username);
    let mySecret = await getSecret(userId);

    if (mySecret) {
      this.setState({ qr: mySecret });
    } else {
      let secret = speakeasy.generateSecret();
      // let qr = secret.base32;

      // Save this value to state and then your DB for the user
      let newuser;
      qrcode.toDataURL(secret.otpauth_url, function(err, data_url) {
        newuser = data_url;
      });
      this.setState({ newuser });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    var verified = speakeasy.totp.verify({
      secret: this.state.newuser,
      encoding: 'base32',
      token: this.state.code
    });
    let { newuser } = this.state;
    if (verified) {
      qr => addSecretToUserDb(this.props.username, qr);
    } else {
      console.log('Wrong code');
    }
  };

  render() {
    const { code, qr, newuser } = this.state;

    return (
      <div>
        {qr ? (
          <Input
            value={code}
            onChange={this.handleSubmit}
            style={{ width: '30%' }}
          />
        ) : (
          <div>
            <div>
              Lets set up 2FA. Please scan this code on your app and fill in the
              code.
            </div>

            <QRCode value={this.state.newuser} />
            <div>
              <p> Enter code on phone </p>
              <Input
                value={code}
                onChange={this.handleSubmit}
                style={{ width: '30%' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SecondFactor;
