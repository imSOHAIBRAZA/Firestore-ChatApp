import {UPDATE_USER_PROFILE,SHOW_USER_PROFILE} from "../types/types";

const INITIAL_STATE = {

    userData: {},
    isLoading: false,
};

const profileReducer = (state = INITIAL_STATE, action) => {

    
    switch (action.type) {

        case SHOW_USER_PROFILE: {
            return {...state, userData: action.data};

        }
        
         case UPDATE_USER_PROFILE: {
            return {...state, userData: action.data}
        }

        default: {
            return state;
        }
    }


};

export default profileReducer;
