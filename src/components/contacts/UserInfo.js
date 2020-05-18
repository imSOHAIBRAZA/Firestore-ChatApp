import React, { Component } from 'react';
import '../../assets/scss/UserInfo.scss';
import classNames from 'classnames';
import { firestore as db } from "../../utils/firebase";
import {  Image } from "react-bootstrap";


class UserInfo extends Component {
    state ={
        imagePath:""
    }
    componentDidMount(){
        const { id } = this.props.data;
        db.collection("users").doc(id).get()
        .then(doc => doc.data())
        .then((value) => {
            // let data = value;
            const {imagePath} = value
            // debugger;
            this.setState({ imagePath})
        })
    }
    render() {
        let name = "";

        const { id } = this.props.data;

        if (this.props.contact) {
            name = this.props.data.name
        } 


        return (
            <div className={classNames("user-info", { "active": this.props.active })}
                onClick={() => this.props.click(id)}>
                {!this.props.contact &&
                    <div className="flex justify-content-between align-items-center">
                        <small className="date">2017-03-23</small>
                        <small>09.58 AM</small>
                    </div>
                }
                <div className="flex user-chat-info">

                    <div className="user-avatar">
                    {
                                    this.state.imagePath?
                                    <Image src={this.state.imagePath} roundedCircle className="w-100 shadow" style={{height:'100%'}} />
                                :
                                        (
                                            name ? name.charAt(0) : ""
                                        )
                                }
                    
                    </div>
                    <div className="flex flex-column  justify-content-center">
                        <p className="user-name">{name ? name : id}</p>
                        {!this.props.contact &&
                            <p className="user-excerpt"></p>
                        }
                    </div>

                </div>

            </div>
        );
    }
}

export default UserInfo;
