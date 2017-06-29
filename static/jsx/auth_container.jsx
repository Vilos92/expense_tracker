import React from 'react';
import { connect } from 'react-redux';


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
                    Must retrieve access token!
                    <button onClick={this.handleClickLogin}>Login</button>
                </div>
            );
        }
        const auth_children = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                access_token: this.props.auth.access_token
            })
        );

        return (
            <div>
                {auth_children}
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

    return {
        login_fetch,
    }; 
};

const ReduxAuthContainer = connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
export default ReduxAuthContainer;
