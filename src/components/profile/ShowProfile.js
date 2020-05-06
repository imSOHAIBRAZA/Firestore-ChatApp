

import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-regular-svg-icons";
import profile from "../../assets/images/profile.jpg";
import {Card,Button,Form} from 'react-bootstrap';


const ShowProfile =({isEdit})=>{
//  const [state, setState] = useState({name:'', bio:'',dob:'',gender:'',profileImg:''});
     

    return(
     <>
        <Card.Img  src={profile} className="profile-photo" />
        <FontAwesomeIcon icon={faEdit} size={"2x"} className="edit-btn" onClick={isEdit} />
        <Card.Title className="profile-name">Joan</Card.Title>
        <Card.Text className="highlight">
            Personal Bio
        </Card.Text>
        <Card.Text>
            Birthday: 16 June 1999
        </Card.Text>
        <Card.Text>
            Gender: Female
        </Card.Text>
     </>
    )
};

export default ShowProfile
  