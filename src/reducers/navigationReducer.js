import {GO_TO_CHAT, GO_TO_CONTACTS, GO_TO_NOTIFICATIONS,GO_TO_PROFILE} from "../types/types";
import {CHAT, CONTACTS, NOTIFICATIONS,PROFILE} from "../types/nav";

const INITIAL_STATE = {
    activePage: CHAT,
};

const navReducer = (state = INITIAL_STATE, action) => {

    console.log(action.type);
    switch (action.type) {
        case GO_TO_CHAT: {
            return {
                activePage: CHAT
            }
        }

        case GO_TO_CONTACTS: {
            return {
                activePage: CONTACTS
            }
        }

        case GO_TO_NOTIFICATIONS: {
            return {
                activePage: NOTIFICATIONS
            }
        }

        case GO_TO_PROFILE: {
            return {
                activePage: PROFILE
            }
        }
        default: {
            return state;
        }
    }


};

export default navReducer;
