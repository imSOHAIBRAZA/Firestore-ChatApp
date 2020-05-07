import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {firestore as db, storage} from "../../utils/firebase";

import profile from "../../assets/images/profile.jpg";
import { Card, Button, Form, Col } from 'react-bootstrap';
import { getItem } from "../../utils/localStorage";
import {getUserProfile} from "../../actions/profileAction";


const EditProfile = ({Userdata}) => {

  //** GET STATE & DISPATCH WITH STORE **//
  const dispatch = useDispatch();
  const { Auth } = useSelector(({ auth }) => ({
    Auth: auth,
}));

  const [data, setData] = useState({ name: undefined, bio: undefined, dob: undefined, gender: undefined });
  
  const [image, setImage] = useState({ preview: "", file: "" });

 

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
    // if (e.target.files.length) {
    //   setImage({
    //     preview: URL.createObjectURL(e.target.files[0]),
    //     raw: e.target.files[0]
    //   });
    // }
  };

  const handleImageChange=e=>{
//     let reader = new FileReader();
//     let raw = e.target.files[0];
//     reader.readAsDataURL(raw);

//     reader.onloadend = () => {
//       setImage({
//         preview: reader.result,
//         raw: raw
//       });
// };
if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        file: e.target.files[0]
      });
    }
  }

  const updateProfile = () => {


    storage.child('/profile-image/'+ image.file.name).put(image.file).then(snapshot => {

      snapshot.ref.getDownloadURL().then(value => {
        console.log('file upload',value);
         const userId = Auth.uid
        var userRef = db.collection("users").doc(userId);
        return userRef.update({...data,imagePath:value})
          .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
      });
  });

 };
     const{name, bio, dob, gender,imagePath} = Userdata;

  return (
    <>
      <label htmlFor="upload-button">
        {image.preview ? (
          <img src={image.preview} className="profile-photo editPropile-photo" alt="dummy" />
        ) : (
            <>
              <img src={imagePath} alt="dummy" className="profile-photo editPropile-photo" />
            </>
          )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <Form.Group className="margin-top60">
        <Form.Row >
          <Form.Control size="sm" type="text" placeholder="Name"
            className="margin-tb-2" name="name" 
            value={name} onChange={handleChange}
          />
          <Form.Control size="sm" type="text" placeholder="Add Personal Bio"
            className="margin-tb-2" name="bio"
            value={bio} onChange={handleChange}
          />
          <Form.Control size="sm" type="text" placeholder="Date of Birth"
            className="margin-tb-2" name="dob"
            value={dob} onChange={handleChange}
          />
          <Form.Control size="sm" type="text" placeholder="Gender"
            className="margin-tb-2" name="gender"
            value={gender} onChange={handleChange}
          />
        </Form.Row>
        <Form.Row className="margin-tb-5" >
          <Col>
            <Button variant="outline-dark" block className="btn">Cancel</Button>
          </Col>
          <Col>
            <Button variant="dark" block className="btn" onClick={updateProfile}>Save</Button>
          </Col>

        </Form.Row >


      </Form.Group>



    </>
  )
};

export default EditProfile