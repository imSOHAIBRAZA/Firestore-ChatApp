import fire, { firestore as db } from "../utils/firebase";
import { SHOW_USER_PROFILE, UPDATE_USER_PROFILE } from "../types/types";



//SET_USER_DATA
export const setProfile = (data) => ({
  type: SHOW_USER_PROFILE,
  data

});

// START_SET_USER_DATA
export const getUserProfile = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;

    return db.collection("users").doc(uid).get().then(value => {
      let userData = value.data();
      dispatch(setProfile(userData));
    });
  }
}

//UPDATE_USER_DATA
export const updateProfile = (data) => ({
  type: UPDATE_USER_PROFILE,
  data

});

// UPDATE_USER_DATA
export const getUpdateProfile = (data) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;

    var userRef = db.collection("users").doc(uid);
    return userRef.update(data)
      .then(function () {
        console.log("Document successfully updated!");
        dispatch(updateProfile(data));
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }
}
