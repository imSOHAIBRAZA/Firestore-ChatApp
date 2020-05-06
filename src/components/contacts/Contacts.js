import React, {Component} from 'react';
import '../../assets/scss/Contacts.scss';
import {FormControl, InputGroup} from "react-bootstrap";
import MaterialIcon from "material-icons-react";
import UserInfo from "./UserInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentAlt} from "@fortawesome/free-regular-svg-icons";
import {connect} from "react-redux";
import {firestore as db} from "../../utils/firebase";
import {setActiveChat, clearAll} from "../../actions/chatActions";
import {addMessages, removeMessages} from "../../actions/threadActions";
import {addContact} from "../../actions/authActions";
import {CHAT, CONTACTS} from "../../types/nav";
import {goToChats, goToContacts} from "../../actions/navigationActions";
import firebase from "firebase";

class Contacts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeChat: null,
            activeChatId: null
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.contacts !== this.props.contacts) {
            console.log(this.props.contacts)
        }
    }

    componentDidMount() {

        db.collection("users").doc(this.props.uid)
            .onSnapshot((snapshot) => {
                if (snapshot.data())
                    snapshot.data().contacts.forEach(v => {
                        db.collection("users").doc(v).get().then(doc => {
                            const {name, email} = doc.data();
                            this.props.addContact({
                                id: v,
                                name, email
                            })
                        })
                    })

                }
            );
    }

    loadMessageThread = (chatId) => {

        this.props.goToChats();
        this.setState({activeChatId: chatId});

        if (this.state.activeChat) {
            this.state.activeChat()
        }
        this.props.setActiveChat(chatId);
        this.props.removeMessages();
        const current = db.collection("chatMessages").doc(chatId).collection("messages").orderBy("timestamp")
            .onSnapshot((snapshot) => {

                    snapshot.docChanges().forEach((changes) => {
                        if (changes.type === "added") {
                            this.props.addMessages(changes.doc.data())
                        }

                    });


                }
            );
        this.setState({activeChat: current})
    };

    initiateChat = (userId) => {
        const members = [this.props.uid, userId];
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        db.collection("userChats").doc(this.props.uid).collection("chats")

            .add({
                members,
                timestamp
            }).then(doc => {
            const chatId = doc.id;
            db.collection("userChats").doc(userId).collection("chats").doc(chatId).set({
                members,
                timestamp
            })
                .then(r => {
                    console.log("Chat Initiated", r);
                    this.loadMessageThread(chatId)
                })


        })
    };

    render() {
        return (
            <div id="contacts" className="position-relative h-100">
                <InputGroup className="mb-3 " id="contact-search">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"><MaterialIcon icon="search" size='30'/></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Search friends, message or phone number"
                    />
                </InputGroup>

                <div id="user-chats">
                    {this.props.nav === CHAT && this.props.chats.details && this.props.chats.details.map(v => {
                        return <UserInfo active={this.state.activeChatId === v.id} key={v.id} data={v}
                                         click={this.loadMessageThread}/>
                    })}

                    {this.props.nav === CONTACTS && this.props.contacts && this.props.contacts.map(v => {
                        return <UserInfo key={v.id} data={v} contact={true} click={() => this.initiateChat(v.id)}/>
                    })}

                </div>

                <div id="new-chat-btn" className="flex align-items-center justify-content-center cursor-pointer"
                     onClick={() => this.props.goToContacts()}>
                    <FontAwesomeIcon icon={faCommentAlt} size={"2x"}/>
                    <span>+</span>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    uid: state.auth.uid,
    contacts: state.auth.contacts,
    chats: state.chats,
    nav: state.nav.activePage
});

export default connect(mapStateToProps, {
    addMessages,
    removeMessages,
    setActiveChat,
    addContact,
    goToChats,
    goToContacts
})(Contacts);
