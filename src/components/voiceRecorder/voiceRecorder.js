import React from 'react';
// import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';
import firebase from "firebase/app";
import { firestore as db, storage } from "../../utils/firebase";
import { connect } from "react-redux";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class VoiceRecorder extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        
        this.setState({ blobURL, isRecording: false });
        this.sendVoiceMessage(blob,blobURL);
      }).catch((e) => console.log(e));
  };

  sendVoiceMessage=(data,blobURL)=>{
    const groupChatId = this.props.uid <= this.props.activeChat ? `${this.props.uid}-${this.props.activeChat}` : `${this.props.activeChat}-${this.props.uid}`

    // const file = event.target.files[0];
    // const filename = file.name.split(".");
    // const ext = filename[filename.length - 1];
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // console.log(ext);
    storage.child("/chats/" + timestamp).put(data).then((snapshot) => {
      snapshot.ref.getDownloadURL().then(value => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        // debugger;
        if (this.props.activeChat) {
          db.collection("chatMessages")
            .doc(groupChatId)
            .collection(groupChatId)
            .add({
              message: {
                type: 'audio',
                data: value,
                extension: 'mp3',
                filename: blobURL
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
  }

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <audio src={this.state.blobURL} controls="controls" />
        </header>
      </div>
    );
  }
}

// export default VoiceRecorder;

const mapStateToProps = state => ({
    uid: state.auth.uid,
    name: state.auth.name,
    activeChat: state.chats.activeChat
  });
  
  export default connect(mapStateToProps, null)(VoiceRecorder);