import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import SignIn from "../components/auth/SignIn";

class SignInPage extends Component {
  render() {
    return (
      <Row>
        <Col
          md={6}
          className="flex justify-content-center align-items-center vh-100"
          style={{ float: "none", margin: "0 auto" }}
        >
          <SignIn />
        </Col>
      </Row>
    );
  }
}

export default SignInPage;
