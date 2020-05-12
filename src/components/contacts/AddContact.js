import React, { Component } from 'react';
import "../../assets/scss/AddContact.scss"
import ChatInputs from "../chat/ChatInputs";
import { Button, Form, ListGroup } from "react-bootstrap";
import { firestore as db } from "../../utils/firebase";
import { connect } from "react-redux";
import { addMessages, removeMessages } from "../../actions/threadActions";
import { setActiveChat } from "../../actions/chatActions";

class AddContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            searchResult: []
        }
    }


    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };


    search = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ searchResult: [] });
        if (this.props.auth.email !== this.state.email) {
            db.collection("users").where("email", "==", this.state.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const { name, email } = doc.data();
                        console.log("SEARCHED USED", name, email);

                        this.setState({
                            searchResult: [...this.state.searchResult, {
                                id: doc.id,
                                name, email
                            }]
                        });

                        console.log(doc.id, " => ", doc.data());
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        }
    };

    addContact = (id) => {

        const user = db.collection("users").doc(this.props.auth.uid);

        user.get().then((doc) => {

            if (doc.data()) {
                let contacts = doc.data().contacts || [];
                let isAlreadyFriend = contacts.find(uid => uid === id)
                if (isAlreadyFriend) {
                    console.log('ALREADY FRIEND')
                }
                else {
                    contacts = [...contacts, id];
                    user.update({
                        contacts
                    })
                }
            } else {
                user.set({
                    contacts: [id]
                })
            }
        })
    };


    render() {
        return (
            <div id="contact-window" className="h-100 position-relative">
                <header className="flex justify-content-between align-items-center padding-30 ">
                    <div className="flex align-items-center">
                        <p className="margin-0 cursor-arrow accent-color font-weight-bold">Add Friends</p>
                    </div>

                </header>
                <section id="add-contact">
                    <section className="padding-15 h-50 bg-white w-50">
                        <p className="margin-0 cursor-arrow accent-color font-weight-bold">Add Friend</p>
                        <Form className="flex flex-column justify-content-between" onSubmit={this.search}>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                            <div id="search-result">
                                <ListGroup variant="flush">

                                    {this.state.searchResult.map(v => {
                                        return <ListGroup.Item key={v.id}>{v.name}<Button
                                            onClick={() => this.addContact(v.id)}>+</Button></ListGroup.Item>
                                    })}


                                </ListGroup>


                            </div>

                            <div className="flex justify-content-between">
                                <Button type={"reset"} variant={"dark"}>Cancel</Button>
                                <Button type={"submit"} className="accent-btn">Search</Button>
                            </div>
                        </Form>


                    </section>
                </section>


            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,

});

export default connect(mapStateToProps, {})(AddContact);
