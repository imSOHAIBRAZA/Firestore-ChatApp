import React, { Component } from "react";
import { Button, Form, Alert, InputGroup, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { withRouter, Link } from "react-router-dom";
import LogoReferror from '../../assets/images/Logo_Referror.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

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
    const { name, value } = e.target;
    this.setState({ [name]: value });
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

    this.setState({ validated: true });
    const { email, password } = this.state;
    if (form.checkValidity()) {
      let res = this.props.loginUser({ email, password });
      if (res) {

      }
      //submit to redux here
    }
  };

  render() {
    return (
      <div className="w-50 h-30 text-center">
        <img src={LogoReferror} alt="Refrror" style={{ height: '60px' }} />
        <h5>Login with your Referror Account</h5>
        <h5>web.referror.com</h5>

        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
          className="sign-in-form"
        >


          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                <FontAwesomeIcon icon={faUser} size={"1x"} className="edit-btn" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1" style={{ background: "white" }}>
                <FontAwesomeIcon icon={faLock} size={"1x"} className="edit-btn" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </InputGroup>

          <Button variant="dark" type="submit" block className="sign-in-btn">
            Sign in
          </Button>
          {this.props.errorMessage && (
            <Alert variant="danger">{this.props.errorMessage}</Alert>
          )}
        </Form>
        <p className="sign-in-info">Do you have an account?
          <Link to="/register" className="signup-link">Sign up now!</Link>
        </p>
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
