import React, { Component } from "react";
import "../../assets/scss/ChatInputs.scss";
import { faSmileBeam } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faMicrophone,
  faPaperclip,
  faPhone,
  faPhoneSlash,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, Modal, Button, Container, Row, Col } from "react-bootstrap";
import { firestore as db, storage } from "../../utils/firebase";
import {openUserMedia,createRoom,joinRoomById,hangUp} from "../../utils/webRtcCall";
import { connect } from "react-redux";
import firebase from "firebase/app";



class ChatInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      show: false,
      // localStream: null,
      // remoteStream: null,
      // peerConnection: null,
      roomDialog: null,
      roomId: null,
      callId: '',
      showCallId: false,
      notification: ''
    };

  }

  

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  sendMessage = (activeChat) => {

    if (activeChat) {
      // const activeChat = this.props.chats.details.filter(v => v.sentBy.uid=== active)[0];
      db.collection("users").doc(activeChat).get()
        .then(doc => doc.data())
        .then((value) => {
          // let data = value;
          const { token } = value;
          // debugger;
          let data = {
            token: token,
            title: "REFERROR ",
            message: "You have received a Message"
          }
          fetch('https://cors-anywhere.herokuapp.com/https://us-central1-refferor-79247.cloudfunctions.net/notification', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            console.log('PUSH NOTIFACTION:', data);
          }).catch(error => {
            console.log('PUSH NOTIFACTION ERROR', error)
          })
        })
    }

  }


  onSubmit = e => {
    if (e.keyCode === 13) {
      this.setState({ input: "" });
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const groupChatId = this.props.uid <= this.props.activeChat ? `${this.props.uid}-${this.props.activeChat}` : `${this.props.activeChat}-${this.props.uid}`

      // const groupChatId =  `${this.props.activeChat}-${this.props.uid}`

      db.collection("chatMessages")
        .doc(groupChatId)
        .collection(groupChatId)
        .add({
          message: {
            type: 'text',
            data: this.state.input
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
        }).catch(error => console.log("ERROR", error))


    }
  };

  onChangeHandler = (event, type) => {

    const groupChatId = this.props.uid <= this.props.activeChat ? `${this.props.uid}-${this.props.activeChat}` : `${this.props.activeChat}-${this.props.uid}`

    const file = event.target.files[0];
    const filename = file.name.split(".");
    const ext = filename[filename.length - 1];

    console.log(ext);
    storage.child("/chats/" + file.name).put(event.target.files[0]).then((snapshot) => {
      snapshot.ref.getDownloadURL().then(value => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        if (this.props.activeChat) {
          db.collection("chatMessages")
            .doc(groupChatId)
            .collection(groupChatId)
            .add({
              message: {
                type: type,
                data: value,
                extension: ext,
                filename: filename[0]
              },
              sentBy: {
                uid: this.props.uid,
                name: this.props.name
              },
              timestamp: timestamp
            })
            .then(() => {
              console.log("Document successfully written!");
            });
        }

      });
      console.log('Uploaded a blob or file!');
    });

  };


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
      <>

        <section
          id="chat-inputs"
          className="flex justify-content-between align-items-center padding-20"
        >
          <FontAwesomeIcon icon={faSmileBeam} />

          <FormControl
            type="text"
            disabled={!this.props.activeChat ? true : false}
            placeholder="Message"
            name="input"
            onChange={this.handleChange}
            value={this.state.input}
            onKeyUp={this.onSubmit}
          />

          <FontAwesomeIcon icon={faPaperclip} onClick={() => this.attachment.click()} />
          <FontAwesomeIcon icon={faPhone} onClick={()=>this.openMedia()} />
          <FontAwesomeIcon icon={faCamera} onClick={() => this.image.click()} />


        </section>
        <input type="file" className="invisible" ref={c => this.attachment = c} accept=
          "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,"
          onChange={event => this.onChangeHandler(event, 'doc')} />
        <input type="file" className="invisible" ref={c => this.image = c} accept="image/*"
          onChange={(event) => this.onChangeHandler(event, 'image')} />



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
      </>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.auth.uid,
  name: state.auth.name,
  activeChat: state.chats.activeChat
});

export default connect(mapStateToProps, null)(ChatInputs);
