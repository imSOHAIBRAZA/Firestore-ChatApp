import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import '../assets/scss/SigninPage.scss';

import SignIn from "../components/auth/SignIn";

class SignInPage extends Component {
  render() {
    return (
      <Row className="sign-in-bg">
        <Col
          md={6}
          className="sign-in-bg-image"
         
        > 
        </Col>
        <Col
          md={6}
          className="flex justify-content-center align-items-center vh-100 "
        >
          <SignIn />
        </Col>
      </Row>
    );
  }
}

export default SignInPage;
