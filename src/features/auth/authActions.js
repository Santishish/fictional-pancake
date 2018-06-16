import {LOGIN_USER, SIGN_OUT_USER} from "./authConstants";

export const login = (credentials) => {
    return {
        type: LOGIN_USER,
        payload: {
            credentials
        }
    }
};

export const logout = () => {
    return {
        type: SIGN_OUT_USER
    }
};
