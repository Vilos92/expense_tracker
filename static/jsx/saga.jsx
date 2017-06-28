import { delay } from 'redux-saga'
import { select, call, put, takeLatest, all } from 'redux-saga/effects'

import { LOGIN_REQUEST, LOGIN_RECEIVE, LOGIN_FAILED } from './reducers.jsx';
import { EXPENSES_REQUEST, EXPENSES_RECEIVE, EXPENSES_FAILED } from './reducers.jsx';
import Api from './api.jsx';


const get_access_token = (state) => state.auth.access_token;


// Auth - Login
function* login_fetch(action) {
	try {
		const access_token = yield call(Api.login_fetch, action.username, action.password);
		yield put({type: LOGIN_RECEIVE, access_token});
	} catch (e) {
		yield put({type: LOGIN_FAILED, message: e.message});
	}
}


export function* watch_login_request() {
    yield takeLatest(LOGIN_REQUEST, login_fetch)
}


// Expenses
function* expenses_fetch(action) {
    const access_token = yield select(get_access_token);

    // The above select for the access token, should handle refreshing if necessary

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
