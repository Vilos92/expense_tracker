import React from 'react';
import { connect } from 'react-redux';

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
                    <FoundationButton onClick={this.handleClickLogin}
                                    large={true} expanded={true}>
                        Login
                    </FoundationButton>
                </div>
            );
        }

        return (
            <div>
                <FoundationButton onClick={this.props.logout}
                                large={true} expanded={true}>
                    Logout
                </FoundationButton>

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
        logout,
    }; 
};

const ReduxAuthContainer = connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
export default ReduxAuthContainer;
