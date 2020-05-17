import {ACTIVE_CHAT, ADD_CHATS, CLEAR_ALL_CHATS, REMOVE_CHATS, UPDATE_CHATS} from "../types/types";
import {store} from '../utils/store';
import {firestore as db} from "../utils/firebase";


export function updateChats(data) {
    const {chatIds} = data;
    //console.log(data)
    return dispatch => {
        dispatch(
            {
                type: UPDATE_CHATS,
                data: chatIds

            }
        );

    };
}

export function addChats(data) {
    // debugger;
    return async dispatch => {

        // const {members} = data;
        const {auth} = store.getState();

        // members.forEach(v=>{
        //     if(auth.uid!==v){
        //         const info=auth.contacts.filter(value => value.id===v)[0];
        //         filtered.push({
        //             ...info
        //         })
        //     }
        // });

        const userInfo = {};
        
        // for (const v of members) {
        //     if (auth.uid !== v) {
        //         await db.collection("users").doc(v).get().then(doc => {
        //             let data = doc.data();
        //             if(data){
        //                 const {name, email, uid} = data;
                        
        //                 userInfo[uid] = {
        //                     name, email
        //                 }
        //             }
                   
        //         })
        //     }
        // }

        dispatch(
            {
                type: ADD_CHATS,
                data: {
                    ...data,
                    members: userInfo
                }

            }
        );

    };
}

export function removeChats(data) {

    return dispatch => {
        dispatch(
            {
                type: REMOVE_CHATS,
                data

            }
        );

    };
}

export function setActiveChat(chatId) {

    return dispatch => {
        dispatch(
            {
                type: ACTIVE_CHAT,
                data: chatId

            }
        );

    };
}

export function clearAll() {

    return dispatch => {
        dispatch(
            {
                type: CLEAR_ALL_CHATS,


            }
        );

    };
}

