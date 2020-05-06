import {ADD_MESSAGE, CLEAR_MESSAGES} from "../types/types";

export function addMessages(data) {

    return dispatch => {
        dispatch(
            {
                type: ADD_MESSAGE,
                data

            }
        );

    };
}

export function removeMessages() {

    return dispatch => {
        dispatch(
            {
                type: CLEAR_MESSAGES

            }
        );

    };
}
