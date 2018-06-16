import { combineReducers } from 'redux';
import eventReducer from "../../features/event/eventReducer";
import {reducer as FormReducer} from "redux-form";
import modalReducer from "../../features/modals/modalReducer";
import authReducer from "../../features/auth/authReducer";
import asyncReducer from "../../features/async/asyncReducer";

const rootReducer = combineReducers({
    events: eventReducer,
    form: FormReducer,
    modals: modalReducer,
    auth: authReducer,
    async: asyncReducer
});

export default rootReducer;