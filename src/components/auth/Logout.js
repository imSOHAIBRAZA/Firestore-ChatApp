import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
class Logout extends Component {
  componentDidMount() {
    this.props.logoutUser();
  }
  render() {
    if (!this.props.uid) {
      return (
        <>
          <Redirect to={ROUTES.signIn} />
        </>
      );
    } else {
      return <div></div>;
    }
  }
}
const mapStateToProps = state => ({
  isLoginPending: state.auth.isLoginPending,
  errorMessage: state.auth.errorMessage,
  uid: state.auth.uid
});
export default connect(mapStateToProps, { logoutUser })(Logout);
