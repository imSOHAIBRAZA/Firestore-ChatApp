

import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import profile from "../../assets/images/profile.jpg";
import { Card, Button, Form } from 'react-bootstrap';


const ShowProfile = ({ isEdit, Userdata }) => {
    //  const [state, setState] = useState({name:'', bio:'',dob:'',gender:'',profileImg:''});

    const { name, bio, dob, gender, imagePath } = Userdata;
    return (
        <>  
            {
            imagePath ? <Card.Img src={imagePath} className="profile-photo" /> :
                <Card.Img src={profile} className="profile-photo" />
            }

            <FontAwesomeIcon icon={faEdit} size={"2x"} className="edit-btn" onClick={isEdit} />
            <Card.Title className="profile-name">{name ? name : 'Enter Your Name'}</Card.Title>
            <Card.Text className="highlight">
                {bio ? bio : 'Personal Bio'}
            </Card.Text>
            <Card.Text>
                Birthday:  {dob ? dob : '16 June 1999'}

            </Card.Text>
            <Card.Text>
                Gender: {gender && gender}
            </Card.Text>
        </>
    )
};

export default ShowProfile
