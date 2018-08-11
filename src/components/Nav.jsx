import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

class Navbar extends PureComponent {
  static propTypes = { title: PropTypes.string.isRequired };

  render() {
    let { title } = this.props;
    return (
      <Wrapper>
        <h1>{title}</h1>
      </Wrapper>
    );
  }
}

export default Navbar;
