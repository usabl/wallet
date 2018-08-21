import speakeasy from 'speakeasy';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import qrcode from 'qrcode';
import { Input, Button, Form } from 'antd';
import {
  addSecretToUserDb,
  getUserId,
  getSecret,
  addVerifiedToUserDb,
  getVerifiedBool,
  FormItems
} from './helpers';

class SecondFactor extends Component {
  state = {
    qr: '',
    newuser: '',
    code: 0,
    loading: false
  };
  async componentDidMount() {
    let userId = await getUserId(this.props.username);
    let verifiedbool = await getVerifiedBool(userId);

    if (verifiedbool) {
      let mySecret = await getSecret(userId);
      this.setState({ qr: mySecret });
    } else {
      let secret = speakeasy.generateSecret();
      let secrethex = secret.hex;

      // Save this value to state and then your DB for the user
      // qrcode.toDataURL(secret.otpauth_url, function(err, data_url) {
      //   newuser = data_url;
      // });
      let newuser = speakeasy.otpauthURL({
        secret: secret.base32,
        label: this.props.username,
        issuer: 'Usabl Wallet',
        encoding: 'base32'
      });
      console.log('url', newuser);
      this.setState({ newuser, secrethex });
    }
  }

  handleSubmitNewUser = async code => {
    this.setState({ loading: true });
    const { newuser, secrethex } = this.state;

    console.log('secwet', secrethex);
    console.log('code', code);

    let verified = speakeasy.totp.verify({
      secret: secrethex,
      encoding: 'hex',
      token: code,
      window: 6
    });

    console.log(verified);

    if (verified) {
      secrethex => addSecretToUserDb(this.props.username, secrethex);
      verified => addVerifiedToUserDb(this.props.username, verified);
      console.log('Added to database');
    } else {
      console.log('Wrong code');
    }
    this.setState({ loading: false });
  };
  handleChange = (field, value) => this.setState({ [field]: value });
  handleSubmit = async e => {
    e.preventDefault();
    var verified = speakeasy.totp.verify({
      secret: this.state.qr,
      encoding: 'base32',
      token: this.state.code
    });

    if (verified) {
      console.log('Verification succesful ');
    } else {
      console.log('Wrong code');
    }
  };

  render() {
    const { code, newuser, loading } = this.state;

    return (
      <div>
        {!newuser ? (
          <Input
            value={code}
            onChange={this.handleSubmit}
            style={{ width: '30%' }}
          />
        ) : (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              this.handleSubmitNewUser(this.state.code);
            }}
          >
            <div>
              Lets set up 2FA. Please scan this code on your app and fill in the
              code.
            </div>

            <QRCode value={this.state.newuser} />

            <div>
              <p> Enter code on phone </p>
              <FormItems
                type="code"
                value={code}
                handleChange={this.handleChange}
                style={{ width: '30%' }}
              />
            </div>
            <div>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  }
}

export default SecondFactor;
