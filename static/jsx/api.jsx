import moment from 'moment';


function handle_fetch_errors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response;
}


function get_auth_header(token) {
    return {Authorization: `Bearer ${token}`};
}


function login_fetch(username, password) {
    const body = {
        username,
        password
    };

    return fetch('/auth/login', {
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
        const refresh_token = json.refresh_token;

        return [access_token, refresh_token]
    }).
    catch(error => {
        console.log(error.message);
    });
}


function register_fetch(username, password) {
    const body = {
        username,
        password
    };

    return fetch('/auth/register', {
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
        const refresh_token = json.refresh_token;

        return [access_token, refresh_token]
    }).
    catch(error => {
        console.log(error.message);
    });
}


function refresh_fetch(refresh_token) {
    const headers = get_auth_header(refresh_token);

    return fetch('/auth/refresh', {
        method: 'POST',
        headers: headers
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        const access_token = json.access_token;

        return access_token;
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
        const expenses = json.expenses;

        return expenses;
    }).
    catch(error => {
        console.log(error.message);
    });
}


function expense_fetch(access_token, expense_id) {
    const headers = get_auth_header(access_token);

    return fetch(`/api/expense/${expense_id}`, {
        method: 'GET',
        headers
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        return json.expense;
    }).
    catch(error => {
        console.log(error.message);
    });
}


function expense_submit(access_token, timestamp, amount, description) {
    const token_headers = get_auth_header(access_token);

    const headers = {
        ...token_headers,
        'Content-Type': 'application/json'
    };

    // Attach timezome to timestamp
    const dt = moment(timestamp);
    const timestamp_with_tz = dt.utc().format();

    const body = {
        timestamp: timestamp_with_tz,
        amount,
        description
    };

    return fetch('/api/expense', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
    }).
    catch(error => {
        console.log(error.message);
    });
}


function expense_update(access_token, expense_id, timestamp, amount, description) {
    const token_headers = get_auth_header(access_token);

    const headers = {
        ...token_headers,
        'Content-Type': 'application/json'
    };

    // Attach timezome to timestamp
    const dt = moment(timestamp);
    const timestamp_with_tz = dt.utc().format();

    const body = {
        timestamp: timestamp_with_tz,
        amount,
        description
    };

    return fetch(`/api/expense/${expense_id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
    }).
    catch(error => {
        console.log(error.message);
    });
}


function expense_delete(access_token, expense_id) {
    const headers = get_auth_header(access_token);

    return fetch(`/api/expense/${expense_id}`, {
        method: 'DELETE',
        headers
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    }).
    catch(error => {
        console.log(error.message);
    });
}


function report_fetch(access_token, start_date, end_date) {
    const headers = get_auth_header(access_token);

    if (start_date) {
        const start_dt = moment(start_date);
        start_date = start_dt.utc().format();
    }

    if (end_date) {
        const end_dt = moment(end_date);
        end_date = end_dt.utc().format();
    }

    let url = '/api/report';
    if (start_date && end_date) {
        url = `${url}?start-date=${start_date}&end-date=${end_date}`;
    } else if (start_date) {
        url = `${url}?start-date=${start_date}`;
    } else if (end_date) {
        url = `${url}?end-date=${end_date}`;
    }

    return fetch(url, {
        method: 'GET',
        headers
    })
    .then(handle_fetch_errors)
    .then(response => response.json())
    .then(json => {
        return json.report;
    }).
    catch(error => {
        console.log(error.message);
    });
}


const Api = {
    register_fetch,
    login_fetch,
    refresh_fetch,
    expenses_fetch,
    expense_fetch,
    expense_submit,
    expense_update,
    expense_delete,
    report_fetch
}

export default Api;
