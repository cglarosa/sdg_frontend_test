import React, { Component } from 'react';
import axios from 'axios';
import { Container, FormGroup, Label, Input, Row, Col, Button, Alert } from 'reactstrap';
import MenuBar from '../MenuBar/MenuBar';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            mismatchPasswordAlert: false,
            loadingPasswordAlert: false,
            successfulPasswordAlert: false
        }
    }

    onChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value });
    }

    changePassword = () => {
        if (this.state.password !== this.state.confirmPassword && this.state.password !== '') {
            this.setState({ mismatchPasswordAlert: true });
        } else {
            this.setState({ loadingPasswordAlert: true, mismatchPasswordAlert: false });
            axios.post('https://warm-tundra-38403.herokuapp.com/users/change/password', [{
                username: localStorage.getItem('username'),
                new_password: this.state.password
            }]).then(response => {
                //console.log(response.data);
                this.setState({ loadingPasswordAlert: false, successfulPasswordAlert: true, password: '', confirmPassword: '' });
            });
        }
    }

    dismissMismatchPasswordAlert = () => {
        this.setState({ mismatchPasswordAlert: false });
    }

    dismissSuccessfulPasswordAlert = () => {
        this.setState({ successfulPasswordAlert: false });
    }

    render() {
        return ( <
            div >
            <
            MenuBar / >
            <
            Container >
            <
            h3 > Settings < /h3> <
            hr / >
            <
            h5 > Change Password < /h5> <
            Alert color = "danger"
            isOpen = { this.state.mismatchPasswordAlert }
            toggle = { this.dismissMismatchPasswordAlert } >
            Passwords do not match. <
                /Alert> <
                Alert color = "light"
            isOpen = { this.state.loadingPasswordAlert } >
            Changing your password, please wait... <
            /Alert> <
            Alert color = "success"
            isOpen = { this.state.successfulPasswordAlert }
            toggle = { this.dismissSuccessfulPasswordAlert } >
            Successfully changed your password. <
            /Alert> <
            Row >
            <
            Col >
            <
            FormGroup >
            <
            Label
            for = "password" > New Password < /Label> <
            Input type = "password"
            name = "password"
            onChange = { this.onChange }
            value = { this.state.password }
            /> <
            /FormGroup>             <
            /Col> <
            Col >
            <
            FormGroup >
            <
            Label
            for = "confirmPassword" > Confirm New Password < /Label> <
            Input type = "password"
            name = "confirmPassword"
            onChange = { this.onChange }
            value = { this.state.confirmPassword }
            /> <
            /FormGroup> <
            /Col> <
            /Row> {
                this.state.password !== '' && this.state.confirmPassword !== '' ? < Button color = 'success'
                onClick = { this.changePassword } > Change Password < /Button> : null} <
                    hr / >
                    <
                    /Container> <
                    /div>
            )
        }
    }

    export default Settings;