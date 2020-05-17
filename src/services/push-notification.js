import fire,{firestore as db ,messaging} from '../utils/firebase'


// Saves the messaging device token to the datastore.
//  export const saveMessagingDeviceToken=(currentToken,uid)=> {
  
//     if (currentToken) {
//       console.log('Got FCM device token:', uid);
//       debugger
//       db.collection('fcmTokens').doc(currentToken)
//           // .set({uid: currentToken});
//     } else {
//       // Need to request permissions to show notifications.
//       askForPermissioToReceiveNotifications();
//     }
  
// }

export const askForPermissioToReceiveNotifications = async () => {
  try {
     await messaging.requestPermission();
    const currentToken = await messaging.getToken();
    console.log('user token: ', currentToken);
    return currentToken
  } catch (error) {
    console.error(error);
  }
}

messaging.onMessage(function (payload) {
    console.log('ON_MESSAGE',payload)
  })