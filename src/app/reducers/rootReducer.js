import { combineReducers } from 'redux';
import eventReducer from "../../features/event/eventReducer";

const rootReducer = combineReducers({
    events: eventReducer
});

export default rootReducer;