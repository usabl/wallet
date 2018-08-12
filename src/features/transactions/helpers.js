import { db } from '../../constants/firebase';
import encrypt from 'crypto-js/hmac-sha256';
import contract from 'truffle-contract';

// Workaround for a compatibility issue between web3@1.0.0-beta.29 and truffle-contract@3.0.3
// https://github.com/trufflesuite/truffle-contract/issues/57#issuecomment-331300494
export const fixTruffleContractCompatibilityIssue = contract => {
  if (typeof contract.currentProvider.sendAsync !== 'function') {
    contract.currentProvider.sendAsync = function() {
      return contract.currentProvider.send.apply(
        contract.currentProvider,
        arguments
      );
    };
  }
  return contract;
};

export const setProviderAndfixTruffleContractCompatibilityIssue = (
  _Counter,
  provider
) => {
  let counter = contract(_Counter);
  counter.setProvider(provider);
  return fixTruffleContractCompatibilityIssue(counter);
};

export const matchPasswords = async (username, password) => {
  let backendPassword = encrypt(username, password).toString();
  let passwordToMatch = await db
    .collection('users')
    .where(`username`, `==`, username)
    .get()
    .then(collection => collection.docs.map(doc => doc.data().password))
    .then(users => users[0]);
  console.log('a', backendPassword, passwordToMatch);
  if (backendPassword === passwordToMatch) {
    return true;
  } else {
    return false;
  }
};
