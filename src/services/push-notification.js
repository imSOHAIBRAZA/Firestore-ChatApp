import {messaging} from '../utils/firebase'

export const askForPermissioToReceiveNotifications = async () => {
  try {
     await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('user token: ', token);

    return token;
  } catch (error) {
    console.error(error);
  }
}