import {LOGIN_USER, SIGN_OUT_USER} from "./authConstants";
import {closeModal} from "../modals/modalActions";

export const login = (credentials) => {
    return dispatch => {
        dispatch({ type: LOGIN_USER, payload: { credentials } });
        dispatch(closeModal())
    }
};

export const logout = () => {
    return {
        type: SIGN_OUT_USER
    }
};
