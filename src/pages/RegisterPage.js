import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import Register from "../components/auth/Register";

class RegisterPage extends Component {
  render() {
    return (
      <Row>
        <Col
          md={6}
          className="flex justify-content-center align-items-center vh-100"
          style={{ float: "none", margin: "0 auto" }}
        >
          <Register />
        </Col>
      </Row>
    );
  }
}

export default RegisterPage;
