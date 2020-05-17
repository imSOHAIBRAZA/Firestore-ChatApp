import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../../assets/scss/Options.scss';
import '../../assets/scss/ChatBubble.scss';

import { Transition } from "react-transition-group";
import { Form, FormCheck, Tab, Tabs, Image } from "react-bootstrap";
import FileIcon, {defaultStyles} from 'react-file-icon';


const duration = 300;

const defaultStyle = {
    transition: `${duration}ms ease-in-out`,
    width: 0,
    overflowX: 'hidden'
};

const transitionStyles = {
    entering: { width: 0 },
    entered: { width: '33.33%' },
    exiting: { width: '33.33%' },
    exited: { width: 0 },
};

class Options extends Component {


    render() {
        return (
            <Transition in={this.props.in} timeout={0}>

                {(state) => (
                    <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }} id="options" className="flex flex-column">

                        <div className="bg-white  padding-15 margin-bottom-10">
                            <p className="accent-color font-weight-bold">Options</p>
                            <div className="flex align-items-center justify-content-center flex-column">
                                <div className="user-avatar">J</div>
                                <p className="margin-0 cursor-arrow">John Doe</p>
                                <span>
                                    <FormCheck
                                        type="switch"
                                        label="Mute notifications"
                                        id="custom-switch"
                                    />

                                </span>
                            </div>

                        </div>

                        <div className="bg-white margin-bottom-10">
                            <p className="accent-color font-weight-bold padding-15">Media</p>
                            <Tabs defaultActiveKey="profile" id="tabs">
                                <Tab eventKey="photos" title="Photos">
                                    {
                                        this.props.data && this.props.data.map((v, i) => {
                                            if (v.message.type === 'image') {
                                                return <Image src={v.message.data} className="" style={{ margin:'5px',height: '70px',width: '70px' }} />
                                            }

                                        })
                                    }

                                </Tab>
                                <Tab eventKey="files" title="Files">
                                {
                                        this.props.data && this.props.data.map((v, i) => {
                                            if (v.message.type === 'doc'){
                                               return <Link download rel={v.message.filename} 
                                                to={v.message.data} className="cursor-pointer text-decoration-none" >
                                                 <FileIcon
                                                     extension={v.message.extension} {...defaultStyles[v.message.extension]}  />
                                                 <span
                                                     className="padding-10">{v.message.filename && v.message.filename.length > 10 ? v.message.filename.substring(0, 10) + "..." : v.message.data.filename}
                                                     </span>
                                             </Link>
                                            }
                                        })
                                    }
                                </Tab>
                                <Tab eventKey="links" title="Links">
                                    links
                                </Tab>
                            </Tabs>

                        </div>

                    </div>
                )}

            </Transition>
        );
    }
}

export default Options;
