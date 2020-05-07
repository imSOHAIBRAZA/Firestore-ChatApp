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

export function registerUser(data) {
  const { email, phoneNumber, name, password } = data;

  return dispatch => {
    dispatch({ type: REGISTRATION_PENDING });

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    return fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        
        db.collection("users")
          .doc(res.user.uid)
          .set({
            uid: res.user.uid,
            email,
            phoneNumber,
            name,
            timestamp: timestamp,
            contacts: []
          })
          .then(() => {
            fire.auth().onAuthStateChanged(function(user) {
              user.sendEmailVerification();
            });
            dispatch({
              type: REGISTRATION_SUCCESS,
              payload: {
                email,
                uid: res.user.uid,

                errorMessage: "",
                isRegistrationPending: false
              }
            });
            console.log("Registration successful");

            return true;
          });
      })
      .catch(function(error) {
        var errorMessage = error.message;
        dispatch({ type: REGISTRATION_FAILED, payload: errorMessage });

        // ...
      });
  };
}

export function loginUser(data) {
  const { email, password } = data;
  return dispatch => {
    dispatch({ type: LOGIN_PENDING });

    return fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user.emailVerified) {

          db.collection("users").doc(res.user.uid).get().then(value => {
            // debugger;
            dispatch({type: LOGIN_SUCCESS, payload: value.data()});
            
          });

          console.log("login successful");
          return true;
        } else {
          throw new Error("Email address is not verified");
        }
      })
      .catch(e => {
        dispatch({ type: LOGIN_FAILED, payload: e.message });
      });
  };
}
export function logoutUser() {
  return dispatch => {
    dispatch({ type: LOGOUT_PENDING });
    return fire
      .auth()
      .signOut()
      .then(function() {
        dispatch({ type: LOGOUT_SUCCESS });
        localStorage.clear();
        return true;
      })
      .catch(function(e) {
        dispatch({ type: LOGOUT_FAILED, payload: e.message });
      });
  };
}

export function addContact(data) {
  return dispatch => {
    dispatch({ type: ADD_CONTACT, data: data });
  };
}
