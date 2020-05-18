import React, {Component} from 'react';
import '../../assets/scss/ChatBubble.scss';
import classNames from 'classnames';
import {Image} from "react-bootstrap";
import FileIcon, {defaultStyles} from 'react-file-icon';

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
                    {this.props.children.type === 'text' ? this.props.children.data :
                        this.props.children.type === 'image' ?
                            <div className="img">
                                <Image src={this.props.children.data} className=""/>
                                <a className="btn btn-sm btn-danger" href={this.props.children.data}
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
            </div>

        );
    }
}

export default ChatBubble;
