import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Nav = styled.nav`
  color: #222;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;
const Title = styled.h2`
  color: gray;
  margin: auto 0;
`;

const Pill = styled.div`
  color: gray;
  display: inline-block;
  transition: background-color 0.15s ease-in-out;
  opacity: 1;
  transition: opacity 0.15s ease-in;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 9999px;
  border-color: gray;
  border-style: solid;
  border-width: 1px;
`;

class Navbar extends PureComponent {
  static propTypes = { title: PropTypes.string.isRequired };

  render() {
    let { title, balance } = this.props;
    return (
      <Nav data-testid="navbar">
        <Title>{title}</Title>
        <div>
          <Pill>{balance}</Pill>
        </div>
      </Nav>
    );
  }
}

export default Navbar;
