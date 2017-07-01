import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { FoundationButton } from './components/foundation.jsx';


class AuthContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickLogin = this.handleClickLogin.bind(this);
    }

    handleClickLogin() {
        this.props.login_fetch('test', 'test1234');
    }

    render() {
        if (!this.props.auth || !this.props.auth.refresh_token || !this.props.auth.access_token) {
            return (
                <div>
                    <p>Please register or login to view your expenses and expense reports.</p>

                    <FoundationButton onClick={this.handleClickLogin}
                                    large={true} expanded={true}>
                        Login
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
        login_fetch,
        logout
    }; 
};

const ReduxAuthContainer = connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
export default ReduxAuthContainer;
