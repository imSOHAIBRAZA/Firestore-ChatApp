import React, { Component } from "react";
import {Link} from 'react-router-dom';
import "../assets/scss/Navigation.scss";
import { Image, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faBell,
  faCommentAlt
} from "@fortawesome/free-regular-svg-icons";
import MaterialIcon from "material-icons-react";
import { connect } from "react-redux";
import {
  goToChats,
  goToContacts,
  goToNotifications,
  goToProfile
} from "../actions/navigationActions";
import classNames from "classnames";
import { CHAT, CONTACTS,NOTIFICATIONS,PROFILE } from "../types/nav";
import { ROUTES } from "../utils/routes";

class Navigation extends Component {
  render() {
    return (
      <div
        id="navigation"
        className="h-100 flex flex-column padding-10 align-items-center justify-content-between "
      >
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="transparent" id="dropdown-basic">
              <Image
                src={
                  "https://cdn2.f-cdn.com/contestentries/1316431/24595406/5ae8a3f2e4e98_thumb900.jpg"
                }
                roundedCircle
                className="w-100 shadow"
              />{" "}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.props.goToProfile()}>Edit your profile</Dropdown.Item>
              <Dropdown.Item href={ROUTES.logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div
            className={classNames("nav-icon", {
              active: this.props.nav === CHAT
            })}
            onClick={() => this.props.goToChats()}
          >
            <FontAwesomeIcon
              icon={faCommentAlt}
              size={"2x"}
              className="text-white"
            />
            <small>Message</small>
          </div>
          <div
            className={classNames("nav-icon", {
              active: this.props.nav === CONTACTS
            })}
            onClick={() => this.props.goToContacts()}
          >
            <FontAwesomeIcon icon={faAddressBook} size={"2x"} />
            <small>Contacts</small>
          </div>
          <div className={classNames("nav-icon", {
              active: this.props.nav === NOTIFICATIONS
            })}
            onClick={() => this.props.goToNotifications()}>
            <FontAwesomeIcon icon={faBell} size={"2x"} />
            <small>Notifications</small>
          </div>
        </div>
        <div>
          <div className="nav-icon">
            <MaterialIcon icon="settings" size="40" />
            <small>Settings</small>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.auth.uid,
  nav: state.nav.activePage
});

export default connect(mapStateToProps, {
  goToChats,
  goToContacts,
  goToNotifications,
  goToProfile
})(Navigation);
