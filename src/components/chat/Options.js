import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../../assets/scss/Options.scss';
import '../../assets/scss/ChatBubble.scss';

import { Transition } from "react-transition-group";
import { Form, FormCheck, Tab, Tabs, Image } from "react-bootstrap";
import FileIcon, {defaultStyles} from 'react-file-icon';
import Linkify from 'react-linkify';


const duration = 300;

const defaultStyle = {
    transition: `${duration}ms ease-in-out`,
    width: 0,
    overflowX: 'hidden',
    boxShadow: '0 0.5rem 1rem rgb(15, 15, 15)'

};

const transitionStyles = {
    entering: { width: 0 },
    entered: { width: '33.33%' },
    exiting: { width: '33.33%' },
    exited: { width: 0 },
};

class Options extends Component {


    render() {
        console.log('OPTION DATA', this.props.userData)
        return (
            <Transition in={this.props.in} timeout={0}>

                {(state) => (
                    <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }} id="options" className="flex flex-column optionDrawer" >

                        <div className="bg-white  padding-15 margin-bottom-10">
                            <p className="accent-color font-weight-bold">Options</p>
                            <div className="flex align-items-center justify-content-center flex-column">
                                <div className="user-avatar">
                                    {
                                    this.props.userData&&this.props.userData.imagePath?
                                    <Image src={this.props.userData.imagePath} roundedCircle className="w-100 shadow" style={{height:'100%'}} />
                                :
                                        (
                                            this.props.data.length>0 && this.props.data[0].sentBy && this.props.data[0].sentBy.name.charAt(0)
                                        )
                                }
                                
                                 </div>
                                <p className="margin-0 cursor-arrow">
                                    {this.props.data.length>0 && this.props.data[0].sentBy && this.props.data[0].sentBy.name}
                                </p>
                                <span>
                                    {/* <FormCheck
                                        type="switch"
                                        label="Mute notifications"
                                        id="custom-switch"
                                    /> */}

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
                                {
                                        this.props.data && this.props.data.map((v, i) => {
                                            const val = v.message.data.slice(0,3)
                                            // debugger;
                                            if (val === 'htt' || val === 'www' ) {
                                                
                                            return <Linkify><p style={{marginLeft:'10px'}}>{v.message.data}</p></Linkify>
                                                // <Image src={v.message.data} className="" style={{ margin:'5px',height: '70px',width: '70px' }} />
                                            
                                            }

                                        })
                                    }
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
