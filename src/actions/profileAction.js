import fire, { firestore as db } from "../utils/firebase";
import {
  REGISTRATION_PENDING,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  ADD_CONTACT,
  LOGOUT_PENDING,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED
} from "../types/types";
import firebase from "firebase/app";


//SET_USER_DATA
export const setProfile = (data) => ({
    type: 'SHOW_USER_PROFILE',
    data

});

// START_SET_USER_DATA
export const getUserProfile = () => {
    return (dispatch,getState) => {
        const uid = getState().auth.uid;
        
       return db.collection("users").doc(uid).get().then(value => {
       let userData=value.data();
            dispatch(setProfile(userData));
            
          });
    }
}
  

// export function getUserProfile(data) {
//   const { email, password } = data;
//   return dispatch => {
//     dispatch({ type: LOGIN_PENDING });

//     return fire
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(res => {
//         if (res.user.emailVerified) {

//           db.collection("users").doc(res.user.uid).get().then(value => {
//             // debugger;
//             dispatch({type: LOGIN_SUCCESS, payload: value.data()});
            
//           });

//           console.log("login successful");
//           return true;
//         } else {
//           throw new Error("Email address is not verified");
//         }
//       })
//       .catch(e => {
//         dispatch({ type: LOGIN_FAILED, payload: e.message });
//       });
//   };
// }



