import React from "react";

// react 16.8 hooks can't do componentDidCatch yet
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? (
      <div>
        <div className="not_found_wrapper">
          <h3 style={{ color: "red" }}>Something went wrong.</h3>
        </div>
      </div>
    ) : (
      this.props.children
    );
  }
}
