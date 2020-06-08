import React, {Component} from 'react';
import '../../assets/scss/ChatBubble.scss';
import classNames from 'classnames';
import {Image} from "react-bootstrap";
import FileIcon, {defaultStyles} from 'react-file-icon';
import Linkify from 'react-linkify';

class ChatBubble extends Component {
    
    render() {
        console.log('BUBBLE', this.props.user)
        return (
            <div className={classNames('flex', 'w-100', 'chat-bubble-wrapper', {
                'justify-content-start': this.props.direction === 'left',
                'justify-content-end': this.props.direction === 'right'
            })}>


               
                <div className='user-avatar'>
                {this.props.userData.name ===this.props.user &&this.props.userData.imagePath?
                 <Image src={this.props.userData.imagePath} roundedCircle className="w-100 shadow" style={{height:'100%'}} />
                 :(this.props.user ? this.props.user.charAt(0).toUpperCase() : "")
                }
                </div>
              
                <div className="chat-bubble">
                    {/* <p>{this.props.time.seconds}</p> */}
                   {/* {const utcDate1 = new Date(Date.UTC(this.props.time.seconds));} */}
                 {/* {console.log('TIME',this.props.time.toDate())} */}
                    {this.props.children.type === 'text' ? <Linkify>{this.props.children.data }</Linkify> :
                        this.props.children.type === 'image' ?
                            <div className="img">
                                <Image src={this.props.children.data} className=""/>
                                <a rel={this.props.children.data}  className="btn btn-sm btn-danger" href={this.props.children.data} download 
                                   target="_blank">Download</a>
                            </div>

                            :
                            <a download rel={this.props.children.filename} target="_blank"
                               href={this.props.children.data} className="cursor-pointer text-decoration-none">
                                <FileIcon
                                    extension={this.props.children.extension} {...defaultStyles[this.props.children.extension]} />
                                <span
                                    className="padding-10">{this.props.children.filename && this.props.children.filename.length > 10 ? this.props.children.filename.substring(0, 10) + "..." : this.props.children.filename}</span>
                            </a>
                    }

                </div>
                <p style={{top: '-4px',fontSize: '10px',color: '#6c757d',padding: '0px 34px',position: 'absolute'}}>
                    {this.props.time&&this.props.time.toDate().toString().slice(0,21)}
                </p>
            </div>

        );
    }
}

export default ChatBubble;
