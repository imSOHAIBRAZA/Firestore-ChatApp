import { firestore as db, storage } from "./firebase";

  
  // mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
  // var servers = {'iceServers': [
  //   {'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, 
  // {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'webrtc.websitebeaver@gmail.com'}
  // ]};

  // http://numb.viagenie.ca/
  const configuration = {
    iceServers: [
      { urls:'stun:stun4.l.google.com:19302'},
      { urls: 'turn:numb.viagenie.ca',
      username: 'referror@gmail.com',
      credential: '123456789' // add password
    },
      
    ],
    iceCandidatePoolSize: 10,
  };
  
  let peerConnection = null;
  let localStream = null;
  let remoteStream = null;
  let roomDialog = null;
  let roomId = null;
  
  // function init() {
  //   openUserMedia()
  //   hangUp()
  //   createRoom()
  //   joinRoom()
  //   // document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  //   // document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  //   // document.querySelector('#createBtn').addEventListener('click', createRoom);
  //   // document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  //   // roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
  // }
  
  export const createRoom=async() =>{
    // document.querySelector('#createBtn').disabled = true;
    // document.querySelector('#joinBtn').disabled = true;
    // const db = firebase.firestore();
    const roomRef = await db.collection('rooms').doc();
  
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
  
    registerPeerConnectionListeners();
  
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  
    // Code for collecting ICE candidates below
    const callerCandidatesCollection = roomRef.collection('callerCandidates');
  
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      callerCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above
  
    // Code for creating a room below
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);
  
    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await roomRef.set(roomWithOffer);
    roomId = roomRef.id;
    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
    // return roomRef.id;
    // document.querySelector(
    //     '#currentRoom').innerText = `Current room is ${roomRef.id} - You are the caller!`;
    // Code for creating a room above
  
    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });
  
    // Listening for remote session description below
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above
  
    // Listen for remote ICE candidates below
    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    return roomRef.id;
    // Listen for remote ICE candidates above
  }
  
  // function joinRoom() {
  //   document.querySelector('#createBtn').disabled = true;
  //   document.querySelector('#joinBtn').disabled = true;
  
  //   document.querySelector('#confirmJoinBtn').
  //       addEventListener('click', async () => {
  //         roomId = document.querySelector('#room-id').value;
  //         console.log('Join room: ', roomId);
  //         document.querySelector(
  //             '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
  //         await joinRoomById(roomId);
  //       }, {once: true});
  //   roomDialog.open();
  // }
  
  export const joinRoomById=async(roomId)=> {
    
    // const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
    console.log('Got room:', roomSnapshot.exists);
  
    if (roomSnapshot.exists) {
      console.log('Create PeerConnection with configuration: ', configuration);
      peerConnection = new RTCPeerConnection(configuration);
      registerPeerConnectionListeners();
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
  
      // Code for collecting ICE candidates below
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above
  
      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
        });
      });
  
      // Code for creating SDP answer below
      const offer = roomSnapshot.data().offer;
      console.log('Got offer:', offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      console.log('Created answer:', answer);
      await peerConnection.setLocalDescription(answer);
  
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
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listening for remote ICE candidates above
    }
  }
  
  export const openUserMedia=async(e)=> {
    const stream = await navigator.mediaDevices.getUserMedia(
        {video: false, audio: true});
    document.querySelector('#localVideo').srcObject = stream;
    localStream = stream;
    remoteStream = new MediaStream();
    document.querySelector('#remoteVideo').srcObject = remoteStream;
  
    console.log('Stream:', localStream);
    // document.querySelector('#cameraBtn').disabled = true;
    // document.querySelector('#joinBtn').disabled = false;
    // document.querySelector('#createBtn').disabled = false;
    // document.querySelector('#hangupBtn').disabled = false;
  }
  
  export const hangUp=async(e)=> {
    // const tracks = document.querySelector('#localVideo').srcObject.getTracks();
    // tracks.forEach(track => {
    //   track.stop();
    // });
  
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
  
    if (peerConnection) {
      peerConnection.close();
    }
  
    // document.querySelector('#localVideo').srcObject = null;
    // document.querySelector('#remoteVideo').srcObject = null;
    // document.querySelector('#cameraBtn').disabled = false;
    // document.querySelector('#joinBtn').disabled = true;
    // document.querySelector('#createBtn').disabled = true;
    // document.querySelector('#hangupBtn').disabled = true;
    // document.querySelector('#currentRoom').innerText = '';
  
    // Delete room on hangup
    if (roomId) {
      // const db = firebase.firestore();
      const roomRef = db.collection('rooms').doc(roomId);
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
  
  const registerPeerConnectionListeners=()=> {
    peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
          `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    });
  
    peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);
      return peerConnection.connectionState
    });
  
    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });
  
    peerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(
          `ICE connection state change: ${peerConnection.iceConnectionState}`);
    });
  }
  
  // init();