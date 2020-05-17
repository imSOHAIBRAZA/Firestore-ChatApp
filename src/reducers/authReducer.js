import {
  REGISTRATION_PENDING,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_PENDING,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  ADD_CONTACT
} from "../types/types";
const INITIAL_STATE = {
  errorMessage: null,
  isRegistrationPending: false,
  email: "",
  uid: "",
  contacts: []
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTRATION_PENDING: {
      return {
        ...state,
        isRegistrationPending: true,
        errorMessage: ""
      };
    }

    case REGISTRATION_SUCCESS: {
      return {
        ...state,
        email: action.payload.email,
        uid: action.payload.uid,
        errorMessage: "",
        isRegistrationPending: false
      };
    }

    case REGISTRATION_FAILED: {
      return {
        ...state,
        results: null,
        errorMessage: action.payload,
        isRegistrationPending: false
      };
    }
    case LOGIN_PENDING: {
      return {
        ...state,
        isLoginPending: true,
        errorMessage: ""
      };
    }

    case LOGIN_SUCCESS: {
      console.log('LOGIN SUCCESS REDUCER',action.payload);
      return {
        ...state,
        uid: action.payload.uid,
        errorMessage: "",
        email: action.payload.email,
        isLoginPending: false,
        name: action.payload.name,
        token:action.payload.token
      };
    }

    case LOGIN_FAILED: {
      return {
        ...state,
        results: null,
        errorMessage: action.payload,
        isLoginPending: false
      };
    }
    case LOGOUT_PENDING: {
      return {
        ...state,
        isLoginPending: true,
        errorMessage: ""
      };
    }

    case LOGOUT_SUCCESS: {
      return { };
    }

    // case LOGOUT_SUCCESS: {
    //   return {
    //     ...state,
    //     uid: "",
    //     errorMessage: "",
    //     isLoginPending: false
    //   };
    // }

    case LOGOUT_FAILED: {
      return {
        ...state,
        results: null,
        errorMessage: action.payload,
        isLoginPending: false
      };
    }
    case ADD_CONTACT: {
      if (state.contacts) {
        let index = state.contacts.findIndex(el => el.id === action.data.id);
        if (index === -1) {
          return {
            ...state,
            contacts: [...state.contacts, action.data]
          };
        }
      } else {
        return {
          ...state,
          contacts: [action.data]
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
