import {ACTIVE_CHAT, ADD_CHATS, CLEAR_ALL_CHATS, REMOVE_CHATS} from "../types/types";

const INITIAL_STATE = {

    userData: {},
    isLoading: false,
};

const profileReducer = (state = INITIAL_STATE, action) => {

    
    switch (action.type) {

        case 'SHOW_USER_PROFILE': {
            // debugger;
            // return {...state, userData: [...state.userData, action.data]};
            return {...state, userData: action.data};

        }
        

        // case UPDATE_USER_PROFILE: {
        //     return {...state, ...action.updates)}
        // }

        default: {
            return state;
        }
    }


};

export default profileReducer;
