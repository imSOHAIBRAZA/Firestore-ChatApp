import React, { Component } from 'react';
import '../../assets/scss/ChatWindow.scss';
import MaterialIcon from "material-icons-react";
import ChatBubble from "./ChatBubble";
import ChatInputs from "./ChatInputs";
import Options from "./Options";
import { firestore as db } from "../../utils/firebase";
import { connect } from "react-redux";
import { FormControl, InputGroup } from "react-bootstrap";

import { addChats, clearAll, removeChats } from "../../actions/chatActions";
import { animateScroll } from "react-scroll";

class ChatWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            optionsVisible: false,
            name: null,
            activeUserData: '',
            search: ''

        }
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "scroll",
            smooth: false,
            duration: 0,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.chats !== this.props.chats) {
            const active = this.props.chats.activeChat;

            if (active) {
                // const activeChat = this.props.chats.details.filter(v => v.sentBy.uid=== active)[0];
                db.collection("users").doc(active).get()
                    .then(doc => doc.data())
                    .then((value) => {
                        // let data = value;

                        const { name } = value;
                        // debugger;
                        this.setState({ name: name, activeUserData: value })
                    })

                // let name = '';
                // debugger

                // if(activeChat.members){
                //     Object.keys(activeChat.members)
                //     .forEach(v => {
                //         name += activeChat.members[v].name
                //     });
                // }
                //    if(activeChat){

                //     this.setState({name: activeChat.sentBy.name})
                //    }

                // this.setState({name: name})

            }

        }
        if (this.props.thread !== prevProps.thread) {
            this.scrollToBottom()
        }
    }


    componentDidMount() {
        const groupChatId = this.props.uid <= this.props.activeChat ? `${this.props.uid}-${this.props.activeChat}` : `${this.props.activeChat}-${this.props.uid}`

        //this.props.clearAll()
        db.collection("chatMessages").doc(groupChatId).collection("messages")
            .onSnapshot((doc) => {
                doc.docChanges().forEach((changes) => {
                    if (changes.type === "added") {
                        this.props.addChats({
                            id: changes.doc.id,
                            ...changes.doc.data()
                        })
                    }
                    if (changes.type === "removed") {
                        this.props.removeChats(changes.doc.id)
                    }
                })


            })

    }

    toggleOptions = () => {
        this.setState({ optionsVisible: !this.state.optionsVisible });
        this.scrollToBottom()
    };

    message=()=>{
         const data = this.props.thread && this.props.thread.filter(m => {
            const msg = m.message.data.toLowerCase().includes(this.state.search.toLowerCase());
            // debugger;
            return msg
        }).map((value, index) => {
            return <ChatBubble key={index}
                userData={this.state.activeUserData}
                user={value.sentBy.name}
                time={value.timestamp}
                direction={value.sentBy.uid === this.props.uid ? 'right' : 'left'}>
                {value.message}
            </ChatBubble>
        });
        return data;
    }

    render() {
        return (
            <div id="chat-window" className="h-100 position-relative">

                <header className="flex justify-content-between align-items-center padding-15 ">
                    <div className="flex align-items-center">
                        <div
                            className="user-avatar">{this.state.name ? this.state.name.charAt(0).toUpperCase() : ""}</div>
                        <p className="margin-0 cursor-arrow">{this.state.name}</p>
                    </div>
                    <div className="flex align-items-center">
                        <span className="flex align-items-center "><MaterialIcon icon="search" size='30' />
                            <input type="text" placeholder="Search Message" value={this.state.search} style={{ border: 'none' }} onChange={e => this.setState({ search: e.target.value })} />
                        </span>



                        <span className="flex align-items-center  margin-lr-10"
                            onClick={this.toggleOptions}><MaterialIcon icon="menu" size='30' id="btn-options" /> Options</span>

                    </div>

                </header>
                <section id="chats">
                    <div id="chats-wrapper">
                        <section className="padding-15 h-100 overflow-y-scroll" id="scroll"
                            ref={instance => this.chatWindow = instance}>
                            {
                                this.message()
                                // this.props.thread && this.props.thread.filter(m => {
                                //     const msg = m.message.data.toLowerCase().includes(this.state.search.toLowerCase());
                                //     return msg
                                // }).map((value, index) => {
                                //     return <ChatBubble key={index}
                                //         userData={this.state.activeUserData}
                                //         user={value.sentBy.name}
                                //         direction={value.sentBy.uid === this.props.uid ? 'right' : 'left'}>
                                //         {value.message}
                                //     </ChatBubble>
                                // })
                            }


                        </section>
                        <ChatInputs />
                    </div>

                    <Options in={this.state.optionsVisible} data={this.props.thread} userData={this.state.activeUserData} />
                </section>


            </div>
        );
    }
}

const mapStateToProps = state => ({
    uid: state.auth.uid,
    chats: state.chats,
    thread: state.thread
});

export default connect(mapStateToProps, { addChats, removeChats, clearAll })(ChatWindow);
