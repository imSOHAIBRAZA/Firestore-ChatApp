import React, {Component} from "react";
import "../../assets/scss/ChatInputs.scss";
import {faSmileBeam} from "@fortawesome/free-regular-svg-icons";
import {
    faCamera,
    faMicrophone,
    faPaperclip
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FormControl} from "react-bootstrap";
import {firestore as db, storage} from "../../utils/firebase";
import {connect} from "react-redux";
import firebase from "firebase/app";

class ChatInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ""
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
                    <FontAwesomeIcon icon={faMicrophone}/>
                    <FontAwesomeIcon icon={faCamera} onClick={() => this.image.click()}/>


                </section>
                <input type="file" className="invisible" ref={c => this.attachment = c} accept=
                    "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,"
                       onChange={event => this.onChangeHandler(event, 'doc')}/>
                <input type="file" className="invisible" ref={c => this.image = c} accept="image/*"
                       onChange={(event) => this.onChangeHandler(event, 'image')}/>
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
