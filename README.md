[![Maintainability](https://api.codeclimate.com/v1/badges/21f0d093fe161f6b2fca/maintainability)](https://codeclimate.com/github/usabl/wallet/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/21f0d093fe161f6b2fca/test_coverage)](https://codeclimate.com/github/usabl/wallet/test_coverage)
[![Build Status](https://travis-ci.org/usabl/wallet.svg?branch=master)](https://travis-ci.org/usabl/wallet)

# Wallet

## Why we built this

### We were the team that built ezether.com. It was a p2p ether exchange dApp, we assumed that web 3.0 was coming and built our product that depended on metamask for authentication and transactions. This was a secure way to handle transactions and authentications. But what we eventually realised was that it was not easy to use, period. It added a complex extra step for the user which most users preferred to avoid. The tech savvy users would go explore more but this was a very small subset of people that dropped to our site.

### We realised this sometime last September adn thought the ecosystem would develop better tools. It seems like we as a group still beleive something like metamask is a natural fit. I see this as a developer bubble, from my base understanding of UX, we need to make the user not think much for an action. Metamask literally puts a cognitive overload on the user.

### The idea with Usabl is simple, we want to create a tool for developers to build out dApps using a client side wallet architecture for easier onboarding. We assume that there is a large security risk and we wouldn't recommend developers to keep large amounts of user money in this wallet. As new wallet solutions pop up, we can see new UX architectures for decentralized apps. One that I can think of right now is having a client side wallet, with the funds stored on a multisig contract like gnosis safe. This ecosystem is going through rapid innovation and we beleive new innovative architectures will come about.

### We hope to get more contributors to come on board and add to this library. As we are delving deeper into the security issues we'd like for a security expert to give his opinion as an issue.

## Instructions to set up

###So to setup the environment
###Update truffle
###Setup a network using Truffle develop
###Compile and migrate on truffle console
###Manually drag the build folder into src as we havent ejected from create-react-app.(Can't reference things out of src)
