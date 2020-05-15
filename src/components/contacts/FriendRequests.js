import React, {Component} from 'react';
import '../../assets/scss/UserInfo.scss';
import { Card, Button, Form, Col } from 'react-bootstrap';

import classNames from 'classnames';

class FriendRequest extends Component {
    render() {
        // let name = "";

        const {id, name} = this.props.data;
        console.log('USER INFOMAOA',this.props.data)
        
        return (
            <div className="user-info" >
                <div className="flex user-chat-info1 justify-content-between">

                    <div className="friendrequest-avatar">{name ? name.charAt(0) : "A"}</div>
                    <div className="flex flex-column  justify-content-center">
                        <p className="user-name">{name ? name : id}</p>
                     </div>
                     
                       <Button variant="outline-dark" size="sm"  className="btn justify-content-center" onClick={()=>this.props.onReject(id)} >Reject</Button>
                        <Button variant="dark" size="sm"  className="btn justify-content-center" onClick={()=>this.props.onAccept(id)} >Accept</Button>
                </div>

            </div>
        );
    }
}

export default FriendRequest;
