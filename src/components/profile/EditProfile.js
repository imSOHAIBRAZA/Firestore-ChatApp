import React, { useState, useEffect, Fragment } from "react";
import profile from "../../assets/images/profile.jpg";
import {Card,Button,Form,Col} from 'react-bootstrap';


const EditProfile =()=>{
 const [state, setState] = useState({name:'', bio:'',dob:'',gender:'',profileImg:''});
     const [image, setImage] = useState({ preview: "", raw: "" });

const handleChange = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };
    return(
        <>
     <label htmlFor="upload-button">
        {image.preview ? (
          <img src={image.preview} className="profile-photo editPropile-photo" alt="dummy"  />
        ) : (
          <>
          <img src={profile} alt="dummy" className="profile-photo editPropile-photo" />
          </>
        )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
            
   <Form.Group className="margin-top60">
  <Form.Row >
      <Form.Control size="sm" type="text" placeholder="Name" className="margin-tb-2" />
      <Form.Control size="sm" type="text" placeholder="Add Personal Bio" className="margin-tb-2" />
      <Form.Control size="sm" type="text" placeholder="Date of Birth" className="margin-tb-2" />
      <Form.Control size="sm" type="text" placeholder="Gender" className="margin-tb-2" />
  </Form.Row>
  <Form.Row className="margin-tb-5" >
    <Col>
        <Button variant="outline-dark" block className="btn">Cancel</Button>
    </Col>
    <Col>
        <Button variant="dark" block className="btn">Save</Button>
    </Col>

  </Form.Row >
  
  
</Form.Group>
   

    
  </>
    )
};

export default EditProfile