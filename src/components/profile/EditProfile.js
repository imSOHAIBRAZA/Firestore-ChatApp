import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore as db, storage } from "../../utils/firebase";
// import { Spinner } from 'reactstrap';
import profile from "../../assets/images/profile.jpg";
import { Card, Button, Form, Col ,Spinner } from 'react-bootstrap';
import { getItem } from "../../utils/localStorage";
import { getUpdateProfile } from "../../actions/profileAction";


const EditProfile = ({ isEdit, Userdata }) => {
console.log("SOHAIB",Userdata)
  //** GET STATE & DISPATCH WITH STORE **//
  const dispatch = useDispatch();
  const { Auth } = useSelector(({ auth }) => ({
    Auth: auth,
  }));
  
  const [data, setData] = useState({
    name: Userdata ? Userdata.name : '',
    bio: Userdata.bio !== undefined ? Userdata.bio : '',
    dob: Userdata.dob!== undefined ? Userdata.dob : '',
    gender: Userdata.gender!== undefined ? Userdata.gender : '',
    imagePath: Userdata.imagePath !== undefined ? Userdata.imagePath : ''
  });

  const [image, setImage] = useState({ preview: ""});
  const [imageLoader, setImageLoader] = useState(false)



  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleImageChange = e => {
    const date = new Date(2018, 11)
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
      });
      setImageLoader(true);
      storage.child('/profile-image/' + e.target.files[0].name+date).put(e.target.files[0]).then(snapshot => {
        
          snapshot.ref.getDownloadURL().then(value => {
          setData({ imagePath: value })
          setImageLoader(false)
          console.log("Image successfully upload!");
        })
          .catch(function (error) {
            console.error("Error uploading Image: ", error);
          });
      });
    }
  }

  const updateProfile = () => {
    // console.log('UPDATE PROFILE',data)
    dispatch(getUpdateProfile(data))
    // const userId = Auth.uid
    // var userRef = db.collection("users").doc(userId);
    // return userRef.update(data)
    //   .then(function () {
    //     console.log("Document successfully updated!");
    //     isEdit();
    //   })
    //   .catch(function (error) {
    //     console.error("Error updating document: ", error);
    //   });
  };
  const { name, bio, dob, gender } = data;

  return (
    <>
    
      <label htmlFor="upload-button">
      {imageLoader? <div className="profile-photo editPropile-photo"> <Spinner variant="danger" animation="grow" /></div>:(image.preview ? (
          
          <img src={image.preview} className="profile-photo editPropile-photo" alt="Profile Image" />
        ) : (
            <>
              {Userdata.imagePath ? <img src={Userdata.imagePath} alt="Profile Image" className="profile-photo editPropile-photo" /> :
                <img src={profile} alt="Profile Image" className="profile-photo editPropile-photo" />
              }
            </>
          ))
      
      
      
      
      
      }
        
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
            <Button variant="outline-dark" block className="btn" onClick={isEdit}>Cancel</Button>
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