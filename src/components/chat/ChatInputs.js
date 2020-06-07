import React, {Component} from "react";
import "../../assets/scss/ChatInputs.scss";
import {faSmileBeam} from "@fortawesome/free-regular-svg-icons";
import {
    faCamera,
    faMicrophone,
    faPaperclip,
    faPhone,
    faPhoneSlash,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FormControl,Modal,Button,Container,Row,Col} from "react-bootstrap";
import {firestore as db, storage} from "../../utils/firebase";
import {connect} from "react-redux";
import firebase from "firebase/app";


const configuration = {
  iceServers: [
    { urls:'stun:stun4.l.google.com:19302'},
    { urls: 'turn:numb.viagenie.ca',
    username: 'sohaibraza789@gmail.com',
    credential: 's03316095789' // add password
  },
    
  ],
  iceCandidatePoolSize: 10,
};

class ChatInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            show:false,
            localStream :null,
            remoteStream:null,
            peerConnection:null,
            roomDialog : null,
            roomId : null,
            callId:'',
            showCallId:false,
            notification:''
        };

        this.attachment = React.createRef();
        this.image = React.createRef()
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    sendMessage =(activeChat)=>{

        if (activeChat) {
            // const activeChat = this.props.chats.details.filter(v => v.sentBy.uid=== active)[0];
            db.collection("users").doc(activeChat).get()
            .then(doc => doc.data())
            .then((value) => {
                // let data = value;
                const { token } = value;
                // debugger;
                let data = {
                    token:token,
                    title:"REFERROR ",
                    message:"You have received a Message"
                   }
                    fetch('https://cors-anywhere.herokuapp.com/https://us-central1-refferor-79247.cloudfunctions.net/notification', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                          },
                        body: JSON.stringify(data)
                      }).then(function(response) {
                        return response.json();
                      }).then(function(data) {
                        console.log('PUSH NOTIFACTION:', data);
                      }).catch(error=>{
                        console.log('PUSH NOTIFACTION ERROR', error)
                      })
            })
        }
       
    }


    onSubmit = e => {
        if (e.keyCode === 13) {
            this.setState({input: ""});
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const groupChatId = this.props.uid <=this.props.activeChat  ?`${this.props.uid}-${this.props.activeChat}` :`${this.props.activeChat}-${this.props.uid}`
           
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
                }).catch(error=>console.log("ERROR",error))
            
            
        }
    };

    onChangeHandler = (event, type) => {

        const groupChatId = this.props.uid <=this.props.activeChat  ?`${this.props.uid}-${this.props.activeChat}` :`${this.props.activeChat}-${this.props.uid}`

        const file = event.target.files[0];
        const filename = file.name.split(".");
        const ext = filename[filename.length - 1];

        console.log(ext);
        storage.child("/chats/" + file.name).put(event.target.files[0]).then((snapshot) => {
            snapshot.ref.getDownloadURL().then(value => {
                const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                if(this.props.activeChat){
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


    registerPeerConnectionListeners=()=> {
  this.state.peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${this.state.peerConnection.iceGatheringState}`);
  });

  this.state.peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${this.state.peerConnection.connectionState}`);
    this.setState({
        notification:this.state.peerConnection.connectionState
    })
  });

  this.state.peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${this.state.peerConnection.signalingState}`);
  });

  this.state.peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${this.state.peerConnection.iceConnectionState}`);
  });
}

//** OFF CALL **//
     hangUp=async()=> {
        // const tracks = document.querySelector('#localVideo').srcObject.getTracks();
        // tracks.forEach(track => {
        //   track.stop();
        // });
        
      
        if (this.state.remoteStream) {
            this.state.remoteStream.getTracks().forEach(track => track.stop());
        }
      
        if (this.state.peerConnection) {
          this.state.peerConnection.close();
        }
      
        // document.querySelector('#localVideo').srcObject = null;
        // document.querySelector('#remoteVideo').srcObject = null;
        // document.querySelector('#cameraBtn').disabled = false;
        // document.querySelector('#joinBtn').disabled = true;
        // document.querySelector('#createBtn').disabled = true;
        // document.querySelector('#hangupBtn').disabled = true;
        // document.querySelector('#currentRoom').innerText = '';
      
        // Delete room on hangup
        if (this.state.roomId) {
        //   const db = firebase.firestore();
          const roomRef = db.collection('rooms').doc(this.state.roomId);
          const calleeCandidates = await roomRef.collection('calleeCandidates').get();
          calleeCandidates.forEach(async candidate => {
            await candidate.ref.delete();
          });
          const callerCandidates = await roomRef.collection('callerCandidates').get();
          callerCandidates.forEach(async candidate => {
            await candidate.ref.delete();
          });
          await roomRef.delete();
        }
        document.location.reload(true);
      }

         handleClose = () => {
              this.setState({show:false})
        }

        handleShow = async() => {
            
            // async function openUserMedia(e) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
                // document.querySelector('#localVideo').srcObject = stream;
                this.state.localStream = stream;
                this.state.remoteStream = new MediaStream();
                // document.querySelector('#remoteVideo').srcObject = remoteStream;
              
                console.log('Stream:',  this.state.remoteStream);
                // document.querySelector('#cameraBtn').disabled = true;
                // document.querySelector('#joinBtn').disabled = false;
                // document.querySelector('#createBtn').disabled = false;
                // document.querySelector('#hangupBtn').disabled = false;
            //   }

              this.setState({show:true})
        }


        //** RECEIVE CALL *//
 joinRoom=()=> {
//   document.querySelector('#createBtn').disabled = true;
//   document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').
      addEventListener('click', async () => {
        this.state.roomId = document.querySelector('#room-id').value;
        console.log('Join room: ', this.state.roomId);
        document.querySelector(
            '#currentRoom').innerText = `Current room is ${this.state.roomId} - You are the callee!`;
        await this.joinRoomById(this.state.roomId);
      }, {once: true});
  this.roomDialog.open();
}
        
  joinRoomById=async(roomId)=> {
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    this.state.peerConnection = new RTCPeerConnection(configuration);
    this.registerPeerConnectionListeners();
    this.state.localStream.getTracks().forEach(track => {
      this.state.peerConnection.addTrack(track, this.state.localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    this.state.peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    this.state.peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        this.state.remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await this.state.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.state.peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await this.state.peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await this.state.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above
  }
}



// ** DIAL CALL **//
 createRoom=async()=> {
//   document.querySelector('#createBtn').disabled = true;
//   document.querySelector('#joinBtn').disabled = true;
//   const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);
  this.state.peerConnection = new RTCPeerConnection(configuration);

  this.registerPeerConnectionListeners();

  this.state.localStream.getTracks().forEach(track => {
    this.state.peerConnection.addTrack(track, this.state.localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  this.state.peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await this.state.peerConnection.createOffer();
  await this.state.peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  this.state.roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
   const groupChatId = this.props.uid <=this.props.activeChat  ?`${this.props.uid}-${this.props.activeChat}` :`${this.props.activeChat}-${this.props.uid}`
         const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            // const groupChatId =  `${this.props.activeChat}-${this.props.uid}`
            
                db.collection("chatMessages")
                .doc(groupChatId)
                .collection(groupChatId)
                .add({
                    message: {
                        type: 'text',
                        data: `Referror Call Code: ${roomRef.id}`
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
                }).catch(error=>console.log("ERROR",error))
//   document.querySelector(
//       '#currentRoom').innerText = `Current room is ${roomRef.id} - You are the caller!`;
  // Code for creating a room above

  this.state.peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      this.state.remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!this.state.peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await this.state.peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await this.state.peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}
       
    

    render() {
      
        return (
            <>
            
                <section
                    id="chat-inputs"
                    className="flex justify-content-between align-items-center padding-20"
                >
                    <FontAwesomeIcon icon={faSmileBeam}/>

                    <FormControl
                        type="text"
                        disabled ={!this.props.activeChat?true:false}
                        placeholder="Message"
                        name="input"
                        onChange={this.handleChange}
                        value={this.state.input}
                        onKeyUp={this.onSubmit}
                    />

                    <FontAwesomeIcon icon={faPaperclip} onClick={() => this.attachment.click()}/>
                    <FontAwesomeIcon icon={faPhone} onClick={this.handleShow}/>
                    <FontAwesomeIcon icon={faCamera} onClick={() => this.image.click()}/>


                </section>
                <input type="file" className="invisible" ref={c => this.attachment = c} accept=
                    "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,"
                       onChange={event => this.onChangeHandler(event, 'doc')}/>
                <input type="file" className="invisible" ref={c => this.image = c} accept="image/*"
                       onChange={(event) => this.onChangeHandler(event, 'image')}/>



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
            <Col sm={6} md={{offset: 4}}>
            <Button variant="secondary" onClick={this.createRoom} className="dialButton" variant="success" size="lg" >
            <FontAwesomeIcon icon={faPhone} />
            </Button>
            {/* </Col> */}
            {/* <Col sm={6} md={ 3}> */}
            <Button variant="secondary" onClick={()=>this.setState({showCallId:!this.state.showCallId})} className="dialButton" style={{color:'white'}} variant="warning" size="lg" >
            <FontAwesomeIcon icon={faUserPlus} />
            </Button>
            {/* </Col> */}
            {/* <Col sm={6} md={2}> */}
            <Button variant="primary" onClick={this.hangUp} className="dialButton" variant="danger" size="lg">
          <FontAwesomeIcon icon={faPhoneSlash} />
          </Button>
            </Col>
          </Row>

          <Row>
           <Col sm={6} md={{offset: 4}}>
           {this.state.showCallId &&
               <>
            <input type="text" value={this.state.callId} onChange={(e)=>this.setState({callId:e.target.value})}/>
           <button className="receiveBtn" onClick={()=>this.joinRoomById(this.state.callId)}>Receive</button>
           </>
           
           }
        
        {this.state.notification? <h3>{this.state.notification}</h3>:''}
          
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
