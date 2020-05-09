import React, {Component} from 'react';
import '../assets/scss/HomePage.scss';
import {Col, Container, Row} from "react-bootstrap";
import Navigation from "../components/Navigation";
import Contacts from "../components/contacts/Contacts";
import ChatWindow from "../components/chat/ChatWindow";
import {connect} from "react-redux";
import AddContact from "../components/contacts/AddContact";
import Notification from "../components/notification/Notification";
import Profile from "../components/profile/Profile";
import {askForPermissioToReceiveNotifications} from "../services/push-notification";
import {messaging} from "../utils/firebase";


import {CHAT} from "../types/nav";


class HomePage extends Component {
    componentDidMount() {
        console.log(this.props.uid)
        askForPermissioToReceiveNotifications()
       
    }

     

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.uid !== prevProps.uid) {
            console.log(this.props.uid)
        }
    }

    renderSwitch(param) {
        switch(param) {
          case 'CHAT':
            return <ChatWindow/>;
          case 'CONTACTS':
            return <AddContact/>;
          case 'NOTIFICATIONS':
            return <Notification/>;
          case 'PROFILE':
            return <Profile/>;
            
          default:
            return null;
        }
      }

    render() {
        return (
            <Container className="flex vh-100 justify-content-center align-items-center main-wrapper">
                <Row className="w-100" id="chat-window-wrapper">
                    <Col md={1} className="padding-0 h-100">
                        <Navigation/>
                    </Col>
                    <Col md={4} className="padding-0 h-100">
                        <Contacts/>
                    </Col>
                    <Col md={7} className="padding-0 h-100">
                        {/* {this.props.nav === CHAT ? <ChatWindow/> : <EditProfile/>} */}

                        {
                            this.renderSwitch(this.props.nav)
                        }

                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    uid: state.auth.uid,
    nav: state.nav.activePage
});

export default connect(mapStateToProps, null)(HomePage);

