import React, { Component, Fragment } from 'react';
import '../../assets/scss/Contacts.scss';
import { FormControl, InputGroup } from "react-bootstrap";
import MaterialIcon from "material-icons-react";
import { toast } from 'react-toastify';
import UserInfo from "./UserInfo";
import FriendRequest from './FriendRequests';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { firestore as db } from "../../utils/firebase";
import { setActiveChat, clearAll } from "../../actions/chatActions";
import { addMessages, removeMessages } from "../../actions/threadActions";
import { addContact } from "../../actions/authActions";
import { CHAT, CONTACTS } from "../../types/nav";
import { goToChats, goToContacts } from "../../actions/navigationActions";
import firebase from "firebase";

class Contacts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeChat: null,
            activeChatId: null,
            friendsRequestList: false,
            getfriendList: []
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.contacts !== this.props.contacts) {
            console.log(this.props.contacts)
        }
    }

    componentDidMount() {
        this.getFriendsList();
        db.collection("users").doc(this.props.uid)
            .onSnapshot((snapshot) => {
                if (snapshot.data())
                if(snapshot.data().contacts){
                    snapshot.data().contacts.forEach(v => {
                        db.collection("users").doc(v).get().then(doc => {
                            const { name, email } = doc.data();
                            this.props.addContact({
                                id: v,
                                name, email
                            })
                        })
                    })
                }
            }
            );


    }

    //** GET FRIEND REQUEST LIST**//
    getFriendsList = () => {
        if (this.props.uid) {
            const FriendRequstUser = db.collection("request").doc(this.props.uid);
            FriendRequstUser.onSnapshot((doc) => {
                // debugger;
                if (doc.data()) {
                    let friendList = doc.data().friendRequests || [];
                    this.setState({ getfriendList: [] });
                    friendList.forEach(v =>
                        this.getUserData(v.id)

                        // db.collection("users").doc(v.id).get()
                        //     .then(doc => doc.data())
                        //     .then((value) => {
                        //         // let data = value;
                        //         const { name } = value;

                        //         this.setState({
                        //             getfriendList: [...this.state.getfriendList, { name, id: v.id }]

                        //         })
                        //     })
                    );

                }
            }

            )}

    }


    //** **//
    getUserData = (id)=>{
        db.collection("users").doc(id).get()
        .then(doc => doc.data())
        .then((value) => {
            // let data = value;
            const { name } = value;

            this.setState({
                getfriendList: [...this.state.getfriendList, { name, id: id }]

            })
        })
    }

    // getFriendsList = async() => {
    //     if (this.props.uid) {
    //         const FriendRequstUser = db.collection("request").doc(this.props.uid);
    //          let RequestSender = await (await FriendRequstUser.get()).data();
    //          let RequestSenderId = RequestSender.frindRequests.map(async(v)=>{
    //          let getRequestSender = await (await db.collection("users").doc(v.id).get()).data();

    //          this.setState({
    //             getfriendList: getRequestSender
    //          })
    //         });

    //     }

    // }


    loadMessageThread = (chatId) => {

        this.props.goToChats();
        this.setState({ activeChatId: chatId });

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
            });
        this.setState({ activeChat: current })
    };

    initiateChat = (userId) => {
        const members = [this.props.uid, userId];
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        db.collection("userChats").doc(this.props.uid).collection("chats").add({
            members,
            timestamp
        }).then(doc => {
            const chatId = doc.id;
            // db.collection("userChats").doc(userId).collection("chats").doc('L97sEJUdUxLyLAt9MXk8').set({
            //     members,
            //     timestamp
            // })
            //     .then(r => {
            //         console.log("Chat Initiated", r);
            //         this.loadMessageThread('L97sEJUdUxLyLAt9MXk8')
            //     })
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

    // initiateChat = (userId) => {
    //     const members = [this.props.uid, userId];
    //     const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    //     db.collection("userChats").doc(this.props.uid).collection("chats").add({
    //         members,
    //         timestamp
    //     }).then(doc => {
    //         const chatId = doc.id;

    //         // db.collection("userChats").doc(userId).collection("chats").doc('L97sEJUdUxLyLAt9MXk8').set({
    //         //     members,
    //         //     timestamp
    //         // })
    //         //     .then(r => {
    //         //         console.log("Chat Initiated", r);
    //         //         this.loadMessageThread('L97sEJUdUxLyLAt9MXk8')
    //         //     })
    //         db.collection("userChats").doc(userId).collection("chats").doc(chatId).set({
    //             members,
    //             timestamp
    //         })
    //             .then(r => {
    //                 console.log("Chat Initiated", r);
    //                 this.loadMessageThread(chatId)
    //             })
    //     })
    // };


    
    //** ACCEPT FRIEND REQUEST **//
    handlerOnAccept=(id)=>{

        const user = db.collection("users").doc(this.props.uid);
        user.get().then(doc => doc.data())
        .then(doc=>{
            let contacts = doc.contacts || [];
                let isAlreadyFriend = contacts.find(uid => uid === id)
                if (isAlreadyFriend) {
                    toast.info("ALREADY FRIEND!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                      });
                }
                else {
                    this.freindRequestSender(id);
                    this.freindRequestReceiver(id);
                    this.friendListRequestUpdate(id);
                }
        })


    }

friendListRequestUpdate=(id)=>{
    
        const FriendRequstUser = db.collection("request").doc(this.props.uid);
        // this.setState({ friendRequests: [] });

        FriendRequstUser.get().then((doc) => doc.data())
        .then(value=>{
            let updatedList = value.friendRequests.filter(v=> v.id !==id);
            // debugger;
            this.setState({ getfriendList: [] });
             FriendRequstUser.update({
                       friendRequests: updatedList
                    });
            updatedList.forEach(v =>
            db.collection("users").doc(v.id).get()
            .then(doc => doc.data())
            .then((value) => {
                // let data = value;
                const { name } = value;
    
                this.setState({
                    getfriendList: [...this.state.getfriendList, { name, id: v.id }]
    
                })
            })
            )
                    
        })
}


freindRequestSender=(id)=>{
    const user = db.collection("users").doc(this.props.uid);
    user.get().then((doc) => {

        if (doc.data()) {
            let contacts = doc.data().contacts || [];
            let isAlreadyFriend = contacts.find(uid => uid === id)
            if (isAlreadyFriend) {
                toast.info("ALREADY FRIEND!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                  });
            }
            else {
                // id mean jo frind add krna hy us ki id
                contacts = [...contacts, id];
                user.update({
                    contacts
                });
                this.friendListRequestUpdate(id);

            }
        } else {
            user.set({
                contacts: [id]
            })
        this.friendListRequestUpdate(id);

        }
    });
}

            freindRequestReceiver=(id)=>{
                const user = db.collection("users").doc(id);
                user.get().then((doc) => {
                    if (doc.data()) {
                        let contacts = doc.data().contacts || [];
                        let isAlreadyFriend = contacts.find(uid => uid === id)
                        if (isAlreadyFriend) {
                            toast.info("ALREADY FRIEND!", {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 2000
                              });
                        }
                        else {
                            // id mean jo frind add krna hy us ki id
                            contacts = [...contacts, this.props.uid];
                            user.update({
                                contacts
                            })
                        }
                    } else {
                        user.set({
                            contacts: [this.props.uid]
                        })
                    }
                })
            }
//** REJECT FRIEND REQUEST **//
    handlerOnReject=(id)=>{
         this.friendListRequestUpdate(id);
    }

    render() {
        console.log('CONTACTS:', this.props.contacts);
        console.log('CHAT:', this.props.chats);
        console.log('NAV:', this.props.nav);
        console.log('ID:', this.props.uid);

        console.log('FRINED LIST:', this.state.getfriendList);


        return (
            <div id="contacts" className="position-relative h-100">

                <InputGroup className="mb-3 " id="contact-search">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"><MaterialIcon icon="search" size='30' /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Search friends, message or phone number"
                    />

                </InputGroup>

                {
                    this.props.nav === CONTACTS &&
                    <div className={`flex  add-info ${this.state.friendsRequestList && 'active'}`} onClick={() => this.setState({
                        friendsRequestList: !this.state.friendsRequestList
                    })}>
                        <div className="add-avatar">
                            <FontAwesomeIcon icon={faUserPlus} size={"1x"} />
                        </div>
                        <div className="flex flex-row  justify-content-center">
                            <p className="user-name1">Friends Requests</p>
                            <p className="request-badge">{this.state.getfriendList && this.state.getfriendList.length}</p>
                        </div>
                    </div>
                }




                <div id="user-chats">
                    {this.props.nav === CHAT && this.props.chats.details && this.props.chats.details.map(v => {
                        return <UserInfo active={this.state.activeChatId === v.id} key={v.id} data={v}
                            click={this.loadMessageThread} />
                    })}
                    {
                        this.props.nav === CONTACTS && this.state.friendsRequestList === true ?
                            <Fragment>
                                
                                {this.state.getfriendList.length>0 && this.state.getfriendList.map(v => {
                                    return <FriendRequest key={v.id} data={v} onReject={this.handlerOnReject} onAccept={this.handlerOnAccept} />
                                })
                                }
                            </Fragment>
                            :
                            (
                                this.props.nav === CONTACTS && this.props.contacts && this.props.contacts.map(v => {
                                    return <UserInfo key={v.id} data={v} contact={true} click={() => this.initiateChat(v.id)} />
                                })
                            )
                    }

                </div>

                <div id="new-chat-btn" className="flex align-items-center justify-content-center cursor-pointer"
                    onClick={() => this.props.goToContacts()}>
                    <FontAwesomeIcon icon={faCommentAlt} size={"2x"} />
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
