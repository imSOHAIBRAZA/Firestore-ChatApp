import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from "./utils/ErrorBoundary";
import { ROUTES } from "./utils/routes";
import { store, persistor } from "./utils/store";
import HomePage from "./pages/HomePage";
import Logout from "./components/auth/Logout";
import "./App.scss";
import { Container } from "react-bootstrap";
import { PersistGate } from "redux-persist/integration/react";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import AppRoutes from "./routes/AppRoutes"

import history from "./utils/history";

function App() {
  // let ret = (
  //   <Switch>
  //     <Route component={HomePage} exact path={ROUTES.landing} />
  //     <Route component={SignInPage} exact path={ROUTES.signIn} />
  //     <Route component={RegisterPage} exact path={ROUTES.register} />
  //     <Route component={Logout} exact path={ROUTES.logout} />
  //   </Switch>
  // );
  return (
    <AppRoutes/>
    // <Container fluid={true} className="content-wrapper">
    //   <Provider store={store}>
    //     <PersistGate loading={null} persistor={persistor}>
    //       <Router history={history}>
    //         <ErrorBoundary children={ret} />
    //       </Router>
    //     </PersistGate>
    //   </Provider>
    // </Container>
  );
}

export default App;
