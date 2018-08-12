import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../../constants/firebase';
import { Form, Input } from 'antd';
import React from 'react';
const FormItem = Form.Item;

export const encryptBackendPassword = (username, password) =>
  encrypt(username, password).toString();

export const addUserToFirebase = (username, password, jsonWallet) => {
  let user = { username, password, jsonWallet };
  db.collection('users').add(user);
};

export const addEncryptedUserToFirebase = (username, _password, jsonWallet) => {
  let password = encrypt(username, _password).toString();
  let user = { username, password, jsonWallet };
  db.collection('users').add(user);
};

export const FormItems = ({ type, handleChange }) => (
  <FormItem>
    <Input
      placeholder={type}
      onChange={e => handleChange(type, e.target.value)}
    />
  </FormItem>
);
