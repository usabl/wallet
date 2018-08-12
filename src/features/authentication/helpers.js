import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../../constants/firebase';
import { Form, Input } from 'antd';
import React from 'react';

const FormItem = Form.Item;

export const encryptBackendPassword = (username, password) =>
  encrypt(username, password).toString();

export const addUserToFirebase = (username, password, jsonWallet) => {
  const user = { username, password, jsonWallet };
  db.collection('users').add(user);
};

export const addEncryptedUserToFirebase = (username, _password, jsonWallet) => {
  const password = encrypt(username, _password).toString();
  const user = { username, password, jsonWallet };
  db.collection('users').add(user);
};

export const FormItems = ({ type, handleChange }) => (
  <FormItem>
    <Input placeholder={type} onChange={e => handleChange(type, e.target.value)} required />
  </FormItem>
);

export const findUserOnFirebase = async (username, password) =>
  await db
    .collection('users')
    .where('username', '==', username)
    .where('password', '==', password)
    .get()
    .then(collection => collection.docs.map(doc => doc.data()))
    .then(users => users[0]);

export const findUsernameOnFirebase = async username =>
  await db
    .collection('users')
    .where('username', '==', username)
    .get()
    .then(collection => collection.docs.map(doc => doc.data()))
    .then(users => users.length === 0);
