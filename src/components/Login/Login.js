import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { authenticate } from '../../actions/userActions';

let ADMIN_USERNAME = 'admin';
let ADMIN_PASSWORD = '18smsl19';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            visible: false,
            isLoading: false
        };
    }

    onChange = (event) => {
        const id = event.target.id;
        const value = event.target.value;
        this.setState({
            [id]: value });
    }

    signUp = () => {
        console.log({
            username: this.state.username,
            password: this.state.password
        });
        this.setState({ isLoading: true, visible: false });
        if (this.state.username === ADMIN_USERNAME && this.state.password === ADMIN_PASSWORD) {
            this.props.history.push('/admin');
        } else {
            axios.post('https://warm-tundra-38403.herokuapp.com/users/confirm', [{
                    username: this.state.username,
                    password: this.state.password
                }])
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ isLoading: false });
                        this.props.authenticate(response.data.user_id);
                        localStorage.setItem('user_id', response.data.user_id);
                        localStorage.setItem('username', this.state.username);
                        axios.post('https://warm-tundra-38403.herokuapp.com/users/goals', [{
                                user_id: response.data.user_id
                            }])
                            .then(response => {
                                if (response.data.status_code === 400) {
                                    this.props.history.push('/home');
                                } else {
                                    this.props.history.push('/survey');
                                }
                            }).catch(error => {
                                if (error.response.status === 400) {
                                    this.props.history.push('/home');
                                }
                            });
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        this.setState({ visible: true, isLoading: false });
                    }
                });
        }
    }

    onDismiss = () => {
        this.setState({ visible: false });
    }

    render() {
        return ( <
                div className = 'container' >
                <
                a href = '/' > Back to home < /a> <
                br / > < br / >
                <
                h4 > Login < /h4> <
                Alert color = 'danger'
                isOpen = { this.state.visible }
                toggle = { this.onDismiss } >
                Invalid username and / or password. <
                /Alert> <
                Alert color = "light"
                isOpen = { this.state.isLoading } >
                <
                Spinner type = 'grow'
                color = 'info' / > Verifying your login credentials, please wait... <
                /Alert> <
                Form >
                <
                FormGroup >
                <
                Label
                for = "accountName" > Email < /Label> <
                Input type = "text"
                name = "text"
                id = "username"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                FormGroup >
                <
                Label
                for = "accountName" > Password < /Label> <
                Input type = "password"
                name = "text"
                id = "password"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                /Form> <
                a href = '/signup' > Don 't have an account? Signup here.</a> <
                br / > { /*<a href='/'>*/ } < Button color = 'info'
                onClick = { this.signUp } > Submit < /Button>{/ * < /a>*/
            } <
            /div>
    );
}
};

const mapStateToProps = state => ({
    user_id: state.user_id
});

const mapActionsToProps = {
    authenticate: authenticate
};

export default connect(mapStateToProps, mapActionsToProps)(Login);