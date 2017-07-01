import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { FoundationButton } from './components/foundation.jsx';


class AuthContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickRegister = this.handleClickRegister.bind(this);
    }

    handleUsernameChange(event) {
        event.preventDefault();
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        event.preventDefault();
        this.setState({password: event.target.value});
    }

    handleClickLogin() {
        const username = this.state.username;
        const password = this.state.password;

        this.props.login_fetch(username, password);
    }

    handleClickRegister() {
        const username = this.state.username;
        const password = this.state.password;

        if (username.length === 0 || password.length === 0) {
            return;
        }

        this.props.register_fetch(username, password);
    }

    render() {
        if (!this.props.auth || !this.props.auth.refresh_token || !this.props.auth.access_token) {
            return (
                <div>
                    <p>Please register or login to view your expenses and expense reports.</p>

                    <input onChange={this.handleUsernameChange} type="text" 
                        value={this.state.username} placeholder="Username" />

                    <input onChange={this.handlePasswordChange} type="password" 
                        value={this.state.password} placeholder="Password" />

                    <FoundationButton onClick={this.handleClickLogin}
                                    large={true} expanded={true}>
                        Login
                    </FoundationButton>

                    <FoundationButton onClick={this.handleClickRegister}
                                    large={true} expanded={true}>
                        Register
                    </FoundationButton>
                </div>
            );
        }

        let logout_button = null;
        if (this.props.auth && this.props.auth.refresh_token) {
            logout_button = (
                <div className="float-right">
                    <FoundationButton onClick={this.props.logout}>
                        Logout
                    </FoundationButton>
                </div>
            );
        }

        return (
            <div>
                <Link to="/">
                    <FoundationButton>
                        Home
                    </FoundationButton>
                </Link>

                {logout_button}

                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};

const mapDispatchToProps = (dispatch) => {
    const register_fetch = (username, password) => {
        dispatch({
            type: 'REGISTER_REQUEST',
            username,
            password
        });
    };

    const login_fetch = (username, password) => {
        dispatch({
            type: 'LOGIN_REQUEST',
            username,
            password
        });
    };

    const logout = () => {
        dispatch({
            type: 'LOGOUT_REQUEST'
        });
    };

    return {
        register_fetch,
        login_fetch,
        logout
    }; 
};

const ReduxAuthContainer = connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
export default ReduxAuthContainer;
