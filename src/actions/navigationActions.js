import {GO_TO_CONTACTS, GO_TO_NOTIFICATIONS,GO_TO_PROFILE, GO_TO_CHAT} from "../types/types";

export function goToChats() {

    return dispatch => {
        dispatch(
            {
                type: GO_TO_CHAT
            }
        );

    };
}

export function goToContacts() {
    console.log("dddddddddddddddddddddddddddd");

    return dispatch => {
        dispatch(
            {
                type: GO_TO_CONTACTS
            }
        );

    };
}

export function goToNotifications() {

    return dispatch => {
        dispatch(
            {
                type: GO_TO_NOTIFICATIONS
            }
        );

    };
}

export function goToProfile() {

    return dispatch => {
        dispatch(
            {
                type: GO_TO_PROFILE
            }
        );

    };
}
