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
        console.log(json);
        const expenses = json.expenses;
        console.log(expenses);

        return expenses;
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

    const body = {
        timestamp,
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
        console.log(json);
    }).
    catch(error => {
        console.log(error.message);
    });
}


const Api = {
    login_fetch,
    refresh_fetch,
    expenses_fetch,
    expense_submit
}

export default Api;
