import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { registerUser } from "../../actions/authActions";
import LogoReferror from '../../assets/images/Logo_Referror.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";

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
      <div className="w-50 text-center">
        <img src={LogoReferror} alt="Refrror" style={{ height: '60px', marginTop: '10px' }} />
        <h6>Sign up for Referror Account</h6>
        <h5>web.referror.com</h5>
        {!this.state.registrationStatus ? (
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
            className="sign-in-form"
          >

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                  <FontAwesomeIcon icon={faUser} size={"1x"} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="email"
                placeholder="Enter email"
                required
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </InputGroup>


            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                  <FontAwesomeIcon icon={faPhone} size={"1x"} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                onChange={this.handleChange}
                value={this.state.phoneNumber}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                  <FontAwesomeIcon icon={faUser} size={"1x"} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                placeholder="Enter name"
                required
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                  <FontAwesomeIcon icon={faLock} size={"1x"} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="password"
                placeholder="Password"
                required
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
              />
            </InputGroup>


            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                  <FontAwesomeIcon icon={faLock} size={"1x"} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                onChange={this.handleChange}
                value={this.state.confirmPassword}
              />
            </InputGroup>
            <Button variant="dark" type="submit" block className="sign-in-btn">
              Sign up
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
