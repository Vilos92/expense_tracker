import { combineReducers } from 'redux';


export const REFRESH_REQUEST = 'REFRESH_REQUEST';
export const REFRESH_RECEIVE = 'REFRESH_RECEIVE';
export const REFRESH_FAILED = 'REFRESH_FAILED';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_RECEIVE = 'LOGIN_RECEIVE';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT = 'LOGOUT';

const default_auth_state = {
    access_token: null,
    refresh_token: null
};

export function auth(state=null, action) {
    switch(action.type) {
        case LOGIN_RECEIVE:
            return {
                ...state, access_token: action.access_token, refresh_token: action.refresh_token
            };
        case REFRESH_RECEIVE:
            return {
                ...state, access_token: action.access_token
            }
        case LOGIN_FAILED:
        case REFRESH_FAILED:
        case LOGOUT:
            return {...state, access_token: null, refresh_token: null};
        default:
            return state;
    }
}


export const EXPENSES_REQUEST = 'EXPENSES_REQUEST';
export const EXPENSES_RECEIVE = 'EXPENSES_RECEIVE';
export const EXPENSES_FAILED = 'EXPENSES_FAILED';
export const EXPENSE_SUBMIT = 'EXPENSE_SUBMIT';
export const EXPENSE_DELETE = 'EXPENSE_DELETE';

const expenses_default_state = {
    data: [],
};

export function expenses(state=expenses_default_state, action) {
    switch(action.type) {
        case EXPENSES_RECEIVE:
            return {...state, data: action.expenses} 
        case EXPENSES_FAILED:
        default:
            return state;
    }
}

const root_reducer = combineReducers({
    auth,
    expenses,
});

export default root_reducer;
