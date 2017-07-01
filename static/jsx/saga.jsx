import moment from 'moment';

import jwtDecode from 'jwt-decode';


import { delay } from 'redux-saga'
import { select, call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'

import { REFRESH_REQUEST, REFRESH_RECEIVE, REFRESH_FAILED,
    LOGIN_REQUEST, LOGIN_RECEIVE, LOGIN_FAILED,
    LOGOUT_REQUEST, LOGOUT } from './reducers.jsx';

import { EXPENSES_REQUEST, EXPENSES_RECEIVE, EXPENSES_FAILED,
    EXPENSE_REQUEST, EXPENSE_RECEIVE, EXPENSE_FAILED,
    EXPENSE_SUBMIT, EXPENSE_UPDATE, EXPENSE_DELETE } from './reducers.jsx';

import { REPORT_REQUEST, REPORT_RECEIVE, REPORT_FAILED } from './reducers.jsx';

import Api from './api.jsx';


// Store selector for authorization - necessary to use token in requests
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
        access_token = auth.access_token;
    }

    return access_token;
}


// Auth - Logout - Can probably just make plain action for this
function* logout(action) {
    yield put({type: LOGOUT});
}


// Yeah, plain action
export function* watch_logout_request() {
    yield takeLatest(LOGOUT_REQUEST, logout)
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


// Expense
function* expense_fetch(action) {
    const access_token = yield get_access_token();

    const expense_id = action.expense_id;

	try {
		const expense = yield call(Api.expense_fetch, access_token, expense_id);
		yield put({type: EXPENSE_RECEIVE, expense});
	} catch (e) {
		yield put({type: EXPENSE_FAILED, message: e.message});
	}
}


export function* watch_expense_request() {
    yield takeLatest(EXPENSE_REQUEST, expense_fetch)
}


// Expense Submit
function* expense_submit(action) {
    const access_token = yield get_access_token();
    
    const timestamp = action.timestamp;
    const amount = action.amount;
    const description = action.description;

	try {
		const response = yield call(Api.expense_submit, access_token,
                timestamp, amount, description);

        yield put({type: EXPENSES_REQUEST}); // Don't do this, use return value

		//yield put({type: EXPENSES_RECEIVE, expenses});
	} catch (e) {
		//yield put({type: EXPENSES_FAILED, message: e.message});
	}
}


export function* watch_expense_submit() {
    yield takeLatest(EXPENSE_SUBMIT, expense_submit)
}


// Expense Update
function* expense_update(action) {
    const access_token = yield get_access_token();
    
    const expense_id = action.expense_id;
    const timestamp = action.timestamp;
    const amount = action.amount;
    const description = action.description;

	try {
		const response = yield call(Api.expense_update, access_token,
                expense_id, timestamp, amount, description);

        yield put({type: EXPENSES_REQUEST}); // Don't do this, use return value

		//yield put({type: EXPENSES_RECEIVE, expenses});
	} catch (e) {
		//yield put({type: EXPENSES_FAILED, message: e.message});
	}
}


export function* watch_expense_update() {
    yield takeLatest(EXPENSE_UPDATE, expense_update)
}


// Expense Delete
function* expense_delete(action) {
    const access_token = yield get_access_token();
    
    const expense_id = action.expense_id;

	try {
		const expenses = yield call(Api.expense_delete, access_token, expense_id);

        yield put({type: EXPENSES_REQUEST}); // Don't do this, use return value

		//yield put({type: EXPENSE_DELETE_RECEIVE, expenses});
	} catch (e) {
		//yield put({type: EXPENSES_DELETE_FAILED, message: e.message});
	}
}


export function* watch_expense_delete() {
    yield takeEvery(EXPENSE_DELETE, expense_delete)
}


// Report Fetch
function* report_fetch(action) {
    const access_token = yield get_access_token();
    
    const start_date = action.start_date;
    const end_date = action.end_date;

	try {
		const report = yield call(Api.report_fetch, access_token, start_date, end_date);

        yield put({type: REPORT_RECEIVE, report}); // Don't do this, use return value
	} catch (e) {
		//yield put({type: EXPENSES_DELETE_FAILED, message: e.message});
	}
}


export function* watch_report_request() {
    yield takeLatest(REPORT_REQUEST, report_fetch)
}


// Combined Saga reducer
export default function* root_saga() {
    yield all([
        watch_login_request(),
        watch_logout_request(),
        watch_expenses_request(),
        watch_expense_request(),
        watch_expense_submit(),
        watch_expense_update(),
        watch_expense_delete(),
        watch_report_request()
    ])
}
