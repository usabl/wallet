import encrypt from 'crypto-js/hmac-sha256';
import { db } from '../../constants/firebase';

export const encryptBackendPassword = (username, password) =>
  encrypt(username, password).toString();

export const addUserToFirebase = (username, password, jsonWallet) => {
  let user = { username, password, jsonWallet };
  db.collection('users').add(user);
};
