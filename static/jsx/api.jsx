import moment from 'moment';

import jwtDecode from 'jwt-decode';


function handle_fetch_errors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response;
}


function get_auth_header(access_token) {
    return {Authorization: `JWT ${access_token}`};
}


function login_fetch(username, password) {
    const body = {
        username,
        password
    };

    return fetch('/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        const access_token = json.access_token;

        const decoded = jwtDecode(access_token);
        //console.log(decoded);

        const created = decoded.iat;
        const expires = decoded.exp;

        const created_moment = moment.unix(created);
        const expires_moment = moment.unix(expires);

        //console.log(created_moment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
        //console.log(expires_moment.format("dddd, MMMM Do YYYY, h:mm:ss a"));

        return access_token;

        // For EVERY fetch which needs auth, check expiration of this token
        // If token is expired, fetch new token
        //
        // Use redux-saga, so that only one token is fetched simultaneously with yield
        // takeLatest to only evaluate most recent fetch for a token
        // getState, access to current token in dispatch(refreshTokenIfNecessary)
        //
        // Separate endpoint takes existing, expired, token
        // Validates if expired token belongs to a real user
        // If token is real user, and is less than 14 days old, return new token
        // Else, return 401 for refresh
    }).
    catch(error => {
        console.log(error.message);
    });
}


function expenses_fetch(access_token) {
    const headers = get_auth_header(access_token);

    return fetch('/api/expense', {
        method: 'GET',
        headers
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        const expenses = json.expenses;
        console.log(expenses);

        return expenses;
    }).
    catch(error => {
        console.log(error.message);
    });
}


const Api = {
    login_fetch,
    expenses_fetch,
}

export default Api;
