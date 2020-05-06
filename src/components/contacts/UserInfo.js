import React, {Component} from 'react';
import '../../assets/scss/UserInfo.scss';
import classNames from 'classnames';

class UserInfo extends Component {
    render() {
        let name = "";

        const {id} = this.props.data;

        if (this.props.contact) {
            name = this.props.data.name
        } else {
            Object.keys(this.props.data.members)
                .forEach(v => {
                    name += this.props.data.members[v].name
                })
        }


        return (
            <div className={classNames("user-info", {"active": this.props.active})}
                 onClick={() => this.props.click(id)}>
                {!this.props.contact &&
                <div className="flex justify-content-between align-items-center">
                    <small className="date">2017-03-23</small>
                    <small>09.58 AM</small>
                </div>
                }
                <div className="flex user-chat-info">

                    <div className="user-avatar">{name ? name.charAt(0) : "A"}</div>
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
