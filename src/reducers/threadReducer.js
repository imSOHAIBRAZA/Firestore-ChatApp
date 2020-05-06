import {ADD_MESSAGE, CLEAR_MESSAGES} from "../types/types";

const INITIAL_STATE = [];

const chatReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case ADD_MESSAGE: {
            return [...state, action.data]
        }

        case CLEAR_MESSAGES: {
            return INITIAL_STATE
        }
        default: {
            return state;
        }
    }


};

export default chatReducer;
