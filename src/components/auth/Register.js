import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { registerUser } from "../../actions/authActions";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      name: "",
      validated: false,
      registrationStatus: false
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({ validated: true });
    if (form.checkValidity()) {
      const { email, phoneNumber, name, password } = this.state;
      let res = this.props.registerUser({
        email,
        phoneNumber,
        name,
        password
      });
      this.setState({
        ...this.state,
        registrationStatus: res
      });
      //submit to redux here
    }
  };

  render() {
    return (
      <div className="w-50 h-50">
        <h1>Register</h1>
        {!this.state.registrationStatus ? (
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <Form.Group controlId="registerEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                onChange={this.handleChange}
                value={this.state.phoneNumber}
              />
            </Form.Group>
            <Form.Group controlId="registerName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                required
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
              />
            </Form.Group>

            <Form.Group controlId="registerPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
              />
            </Form.Group>

            <Form.Group controlId="registerConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                onChange={this.handleChange}
                value={this.state.confirmPassword}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        ) : (
          <p>Please verify your email address</p>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isRegistrationPending: state.auth.isRegistrationPending,
  errorMessage: state.auth.errorMessage,
  email: state.auth.email,
  uid: state.auth.uid
});

export default connect(mapStateToProps, { registerUser })(Register);
