import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Navbar extends PureComponent {
  static propTypes = { title: PropTypes.string.isRequired };

  render() {
    let { title } = this.props;
    return (
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
    );
  }
}

export default Navbar;
