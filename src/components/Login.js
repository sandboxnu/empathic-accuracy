/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import Axios from 'axios';
import { func } from 'prop-types';
import { Form, Text } from 'informed';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://api.sandboxneu.com/empathic-accuracy';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badPassword: false,
      password: null,
    };
  }

  onPassword() {
    const { password } = this.state;
    const { onPassword } = this.props;
    Axios.post(`${SERVER_URL}/login`, {}, {
      auth: {
        username: 'user',
        password,
      },
    }).then(() => {
      onPassword(password);
    }).catch(() => {
      this.setState({ badPassword: true });
    });
  }

  render() {
    const { badPassword } = this.state;
    return (
      <div className="container">
        <Form
          onChange={(s) => { this.setState({ password: s.values.inputPassword }); }}
          onSubmit={() => { this.onPassword(); }}
        >
          <div className="form-group">
            <label htmlFor="inputPassword">Password</label>
            <Text field="inputPassword" type="password" className="form-control" id="inputPassword" placeholder="Password" />
          </div>
          {badPassword ? <div>Incorrect Password!</div> : null}
          <button type="submit" className="btn btn-primary">Submit</button>
        </Form>
      </div>
    );
  }
}


Login.propTypes = {
  onPassword: func.isRequired,
};


export default Login;
