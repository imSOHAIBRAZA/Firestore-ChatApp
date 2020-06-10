import React, { Component } from 'react';
import '../../assets/scss/ChatWindow.scss';
import MaterialIcon from "material-icons-react";
import ChatBubble from "./ChatBubble";
import ChatInputs from "./ChatInputs";
import Options from "./Options";
import { firestore as db } from "../../utils/firebase";
import { connect } from "react-redux";
import { FormControl, InputGroup,Modal,Button, Container, Row, Col  } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {openUserMedia,createRoom,joinRoomById,hangUp} from "../../utils/webRtcCall";
import { addChats, clearAll, removeChats } from "../../actions/chatActions";
import { animateScroll } from "react-scroll";
import firebase from "firebase/app";
import {faPhone,
    faPhoneSlash,
    faUserPlus} from "@fortawesome/free-solid-svg-icons";
class ChatWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            optionsVisible: false,
            name: null,
            activeUserData: '',
            search: '',
            show: false,
      roomDialog: null,
      roomId: null,
      callId: '',
      showCallId: false,
      notification: ''

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


    
  //** OFF CALL **//
  hangUpHandler = () => {
    hangUp()
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  openMedia=()=>{
    openUserMedia()
    this.setState({
      show: true
      })
  }

 

 

createRoomHandler=async()=>{
    const roomId = await createRoom();
    
    const groupChatId = this.props.uid <= this.props.activeChat ? `${this.props.uid}-${this.props.activeChat}` : `${this.props.activeChat}-${this.props.uid}`
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // const groupChatId =  `${this.props.activeChat}-${this.props.uid}`

    console.log('ROOM ID',roomId)
    db.collection("chatMessages")
      .doc(groupChatId)
      .collection(groupChatId)
      .add({
        message: {
          type: 'text',
          data: `Referror Call Code: ${roomId}`
        },
        sentBy: {
          uid: this.props.uid,
          name: this.props.name
        },
        timestamp: timestamp
      })
      .then(() => {
        this.sendMessage(this.props.activeChat)
        console.log("Document successfully written!");
      }).catch(error => console.log("ERROR", error));
  }
 

  joinRoomHandler=()=>{
    joinRoomById(this.state.callId).then(e=>console.log('SOHAIBSS',e))
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
                    {!this.props.activeChat ? '' : <>
          <FontAwesomeIcon icon={faPhone} onClick={()=>this.openMedia()} />
</>
}
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


                <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          dialogClassName="modal-90w"
          aria-labelledby="contained-modal-title-vcenter"
          centered

        >
          <Modal.Header closeButton>
            {/* <Modal.Title>Modal title</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <Container className="dialModal">
              <Row>
                <Col sm={6} md={{ offset: 4 }}>
                  <Button variant="secondary" onClick={()=>this.createRoomHandler()} className="dialButton" variant="success" size="lg" >
                    <FontAwesomeIcon icon={faPhone} />
                  </Button>
                  {/* </Col> */}
                  {/* <Col sm={6} md={ 3}> */}
                  <Button variant="secondary" onClick={() => this.setState({ showCallId: !this.state.showCallId })} className="dialButton" style={{ color: 'white' }} variant="warning" size="lg" >
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Button>
                  {/* </Col> */}
                  {/* <Col sm={6} md={2}> */}
                  <Button variant="primary" onClick={this.hangUpHandler} className="dialButton" variant="danger" size="lg">
                    <FontAwesomeIcon icon={faPhoneSlash} />
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col sm={6} md={{ offset: 4 }}>
                  {this.state.showCallId &&
                    <>
                      <input type="text" value={this.state.callId} onChange={(e) => this.setState({ callId: e.target.value })} />
                      <button className="receiveBtn" onClick={() => this.joinRoomHandler()}>Receive</button>
                    </>

                  }

                  {this.state.notification ? <h3>{this.state.notification}</h3> : ''}
                
                </Col>
              </Row>
            </Container>

          </Modal.Body>
        </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    uid: state.auth.uid,
    chats: state.chats,
    thread: state.thread,
  name: state.auth.name,
  activeChat: state.chats.activeChat
});

export default connect(mapStateToProps, { addChats, removeChats, clearAll })(ChatWindow);
