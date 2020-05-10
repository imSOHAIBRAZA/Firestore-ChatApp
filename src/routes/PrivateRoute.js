import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, isAuthanicated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthanicated === true ? (
        <div>

          <Component {...props} />
        </div>
      ) : (
          <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }}
          />
        )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isAuthanicated: !!state.auth.uid

});

export default connect(mapStateToProps)(PrivateRoute);