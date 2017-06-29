import moment from 'moment';

import jwtDecode from 'jwt-decode';


import { delay } from 'redux-saga'
import { select, call, put, takeLatest, all } from 'redux-saga/effects'

import { REFRESH_REQUEST, REFRESH_RECEIVE, REFRESH_FAILED,
    LOGIN_REQUEST, LOGIN_RECEIVE, LOGIN_FAILED } from './reducers.jsx';
import { EXPENSES_REQUEST, EXPENSES_RECEIVE, EXPENSES_FAILED } from './reducers.jsx';
import Api from './api.jsx';


const get_auth = (state) => state.auth;


// Auth - Login
function* login_fetch(action) {
	try {
		const auth = yield call(Api.login_fetch, action.username, action.password);
        const access_token = auth[0];
        const refresh_token = auth[1]

		yield put({type: LOGIN_RECEIVE, access_token, refresh_token});
	} catch (e) {
		yield put({type: LOGIN_FAILED, message: e.message});
	}
}


export function* watch_login_request() {
    yield takeLatest(LOGIN_REQUEST, login_fetch)
}


// Auth - Refresh
function* refresh_fetch() {
	try {
        const auth = yield select(get_auth);
        const refresh_token = auth.refresh_token;

		const access_token = yield call(Api.refresh_fetch, refresh_token);

		yield put({type: REFRESH_RECEIVE, access_token});
	} catch (e) {
		yield put({type: REFRESH_FAILED, message: e.message});
	}
}


// Auth - Retrieve (and refresh if necessary) access token
export function* get_access_token() {
    let auth = yield select(get_auth);
    let access_token = auth.access_token;

    const decoded = jwtDecode(access_token);

    const expires = decoded.exp;
    const expires_moment = moment.unix(expires);

    const time_until_exp = expires_moment.diff(moment(), 'seconds');

    if (time_until_exp <= 60) {
        yield call(refresh_fetch);

        auth = yield select(get_auth);
        console.log(access_token === auth.access_token);
        access_token = auth.access_token;
    }

    return access_token;
}


// Expenses
function* expenses_fetch(action) {
    const access_token = yield get_access_token();

	try {
		const expenses = yield call(Api.expenses_fetch, access_token);
		yield put({type: EXPENSES_RECEIVE, expenses});
	} catch (e) {
		yield put({type: EXPENSES_FAILED, message: e.message});
	}
}


export function* watch_expenses_request() {
    yield takeLatest(EXPENSES_REQUEST, expenses_fetch)
}


export default function* root_saga() {
    yield all([
        watch_login_request(),
        watch_expenses_request()
    ])
}
