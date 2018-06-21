import { combineReducers } from 'redux';
import eventReducer from "../../features/event/eventReducer";
import {reducer as FormReducer} from "redux-form";
import { reducer as toastrReducer } from 'react-redux-toastr';
import modalReducer from "../../features/modals/modalReducer";
import authReducer from "../../features/auth/authReducer";
// import asyncReducer from "../../features/async/asyncReducer";
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    events: eventReducer,
    form: FormReducer,
    modals: modalReducer,
    auth: authReducer,
    // async: asyncReducer,
    toastr: toastrReducer
});

export default rootReducer;