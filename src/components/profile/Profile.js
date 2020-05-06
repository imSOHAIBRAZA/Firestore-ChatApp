import React, { useState, useEffect, Fragment } from "react";
import '../../assets/scss/Profile.scss';
import {Card,Button} from 'react-bootstrap';
import profilecover from "../../assets/images/profile-cover-photo.jpg";
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';
import profile from "../../assets/images/profile.jpg";



const Profile=()=>{
     const [state, setState] = useState({name:'', bio:'',dob:'',gender:'',profileImg:''});
     const [editToggle, setEditToggle] = useState(false);

const editData=()=>{
       setEditToggle(true)
     }

    return (
      <div id="profile-window" className="h-100 position-relative">
      <header className="flex justify-content-between align-items-center padding-30 ">
          <div className="flex align-items-center">
              <p className="margin-0 cursor-arrow accent-color font-weight-bold">Profile</p>
          </div>
      </header>
      <section id="profile-card">
      <section className="padding-15 h-50  w-50">
      
      <Card style={{ width: '20rem' }} className="align-items-center text-center">
        <Card.Img variant="top" src={profilecover} />
        <Card.Body>
        
        {
          editToggle ? <EditProfile />:<ShowProfile isEdit={editData}/>
        }
  </Card.Body>
</Card>


  </section>
</section>
    

  </div>
      );
}
export default Profile;


{/* <section id="add-contact">
<section className="padding-15 h-50 bg-white w-50">
      <p className="margin-0 cursor-arrow accent-color font-weight-bold">SOHAIB</p>
    
          <div id="search-result">

          </div>

          <div className="flex justify-content-between">
          </div>
      


  </section>
</section> */}
