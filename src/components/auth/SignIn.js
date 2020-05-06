import React, { Component } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validated: false
    };
  }

  handleChange = e => {
    const {name, value} = e.target;
    this.setState({[name]: value});
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.uid) {
      this.props.history.push("/");
    }
  }

  handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({validated: true});
    const {email, password} = this.state;
    if (form.checkValidity()) {
      let res = this.props.loginUser({email, password});
      if (res) {

      }
      //submit to redux here
    }
  };

  render() {
    return (
      <div className="w-50 h-50">
        <h1>Sign In</h1>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          {this.props.errorMessage && (
            <Alert variant="danger">{this.props.errorMessage}</Alert>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoginPending: state.auth.isLoginPending,
  errorMessage: state.auth.errorMessage,
  uid: state.auth.uid
});

export default withRouter(connect(mapStateToProps, { loginUser })(SignIn));
