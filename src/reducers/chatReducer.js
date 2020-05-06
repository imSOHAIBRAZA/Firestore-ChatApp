import {ACTIVE_CHAT, ADD_CHATS, CLEAR_ALL_CHATS, REMOVE_CHATS} from "../types/types";

const INITIAL_STATE = {
    activeChat: null,
    details: []
};

const chatReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case ADD_CHATS: {
            let index = state.details.findIndex(el => el.id === action.data.id);
            if (index === -1) {
                return {
                    ...state, details: [...state.details, action.data]
                }
            }
            return state;
        }

        case REMOVE_CHATS: {
            return {...state, details: state.details.filter(v => v.id !== action.data)}
        }

        case ACTIVE_CHAT: {
            return {...state, activeChat: action.data}
        }
        case CLEAR_ALL_CHATS: {
            return INITIAL_STATE
        }
        default: {
            return state;
        }
    }


};

export default chatReducer;
