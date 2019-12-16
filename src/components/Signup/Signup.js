import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CustomInput } from 'reactstrap';
import axios from 'axios';

let PROFESSORS = [
    'Dr. Bongolan',
    'Dr. Cruz',
    'Prof. Rivera'
]

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            primary_aff: '',
            secondary_aff: '',
            educ_attain: '',
            yrs_exp: '',
            name: '',
            isLoading: false,
            confirmPassword: '',
            mismatchPasswordAlert: false,
            professorDropdown: false,
            professor: '',
            acknowledge: false
        };
    }

    onChange = (event) => {
        const id = event.target.id;
        const value = event.target.value;
        this.setState({
            [id]: value });
    }

    signUp = () => {
        this.setState({ mismatchPasswordAlert: false, isLoading: true });
        if (this.state.password === this.state.confirmPassword && this.state.password !== '') {
            axios.post('https://warm-tundra-38403.herokuapp.com/users/add', [{
                    username: this.state.username,
                    password: this.state.password,
                    primary_aff: this.state.primary_aff,
                    secondary_aff: this.state.secondary_aff,
                    educ_attain: this.state.educ_attain,
                    yrs_exp: this.state.yrs_exp,
                    name: this.state.name,
                    contact_person: this.state.professor,
                    acknowledge: this.state.acknowledge,
                    pending: true
                }])
                .then(response => {
                    this.setState({ isLoading: false });
                    if (response.status === 200) {
                        this.props.history.push('/');
                    }
                });
        } else {
            this.setState({ mismatchPasswordAlert: true, isLoading: false });
        }
    }

    dismissMismatchPasswordAlert = () => {
        this.setState({ mismatchPasswordAlert: false });
    }

    toggleProfessorDropdown = () => {
        this.setState({ professorDropdown: !this.state.professorDropdown });
    }

    selectProfessor = (professor) => {
        this.setState({ professor: professor });
    }

    handleClick = () => {
        this.setState({ acknowledge: !this.state.acknowledge });
    }

    render() {
        return ( <
                div className = 'container' >
                <
                a href = '/' > Back to home < /a> <
                br / > < br / >
                <
                h4 > Signup < /h4> <
                h5 > Personal Information < /h5> <
                Form >
                <
                FormGroup >
                <
                Label
                for = "name" > Name < /Label> <
                Input type = "text"
                name = "text"
                id = "name"
                placeholder = "Juan dela Cruz"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                FormGroup >
                <
                Label
                for = "primary_aff" > Primary Affiliation(usually an office) < /Label> <
                Input type = "text"
                name = "text"
                id = "primary_aff"
                onChange = { this.onChange }
                placeholder = "University of the Philippines Diliman" / >
                <
                /FormGroup> <
                FormGroup >
                <
                Label
                for = "secondary_aff" > Secondary Affiliation(usually a school) < /Label> <
                Input type = "text"
                name = "text"
                id = "secondary_aff"
                onChange = { this.onChange }
                placeholder = "University of the Philippines Diliman" / >
                <
                /FormGroup> <
                FormGroup check >
                <
                CustomInput type = "checkbox"
                id = "exampleCustomCheckbox"
                label = "I would like to be acknowledged in the website, appendix for the paper and anywhere else regarding this study. (Only NAME and PRIMARY AFFILIATION will be shown)"
                checked = { this.state.acknowledge }
                onClick = { this.handleClick }
                /> <
                /FormGroup> <
                br / >
                <
                Label
                for = "educ_attain" > Highest Educational Attainment < /Label> <
                FormGroup check id = "educ_attain" >
                <
                Label check >
                <
                Input type = "radio"
                value = "bachelor's degree"
                onChange = { this.onChange }
                id = "educ_attain"
                name = "educ_attain" / > { ' ' }
                Bachelor 's Degree <
                /Label> <
                /FormGroup> <
                FormGroup check >
                <
                Label check >
                <
                Input type = "radio"
                value = "master's or professional degree"
                onChange = { this.onChange }
                id = "educ_attain"
                name = "educ_attain" / > { ' ' }
                Master 's or Professional Degree <
                /Label> <
                /FormGroup> <
                FormGroup check >
                <
                Label check >
                <
                Input type = "radio"
                value = "phd degree"
                onChange = { this.onChange }
                id = "educ_attain"
                name = "educ_attain" / > { ' ' }
                PhD Degree <
                /Label> <
                /FormGroup> <
                br / >
                <
                Label
                for = "yrs_exp" > How long have you been in the general area of sustainability / development studies or practice ? (may include years in graduate school) < /Label> <
                FormGroup check id = 'yrs_exp' >
                <
                Label check >
                <
                Input type = "radio"
                value = "less than 5"
                onChange = { this.onChange }
                id = 'yrs_exp'
                name = "yrs_exp" / > { ' ' }
                Less than 5 years <
                /Label> <
                /FormGroup> <
                FormGroup check >
                <
                Label check >
                <
                Input type = "radio"
                value = "less than 10"
                onChange = { this.onChange }
                id = 'yrs_exp'
                name = "yrs_exp" / > { ' ' }
                Less than 10 years <
                /Label> <
                /FormGroup> <
                FormGroup check >
                <
                Label check >
                <
                Input type = "radio"
                value = "more than 10"
                onChange = { this.onChange }
                id = 'yrs_exp'
                name = "yrs_exp" / > { ' ' }
                More than 10 years <
                /Label> <
                /FormGroup> <
                br / >
                <
                FormGroup >
                <
                Label >
                Professor / Contact Person <
                /Label> <
                br / >
                <
                ButtonDropdown isOpen = { this.state.professorDropdown }
                toggle = { this.toggleProfessorDropdown } >
                <
                DropdownToggle color = 'info'
                caret > { this.state.professor === '' ? 'Select Professor' : this.state.professor } <
                /DropdownToggle> <
                DropdownMenu > {
                    PROFESSORS.map((item, i) => {
                        return ( <
                            DropdownItem onClick = {
                                () => this.selectProfessor(item) } > { item } <
                            /DropdownItem>
                        )
                    })
                } <
                /DropdownMenu> <
                /ButtonDropdown> <
                /FormGroup> <
                /Form> <
                br / >
                <
                h5 > Login Credentials < /h5> <
                Alert color = "light"
                isOpen = { this.state.isLoading } >
                Creating your account, please wait... <
                /Alert> <
                Alert color = "danger"
                isOpen = { this.state.mismatchPasswordAlert }
                toggle = { this.dismissMismatchPasswordAlert } >
                Passwords do not match. <
                    /Alert> <
                    Form >
                    <
                    FormGroup >
                    <
                    Label
                for = "accountName" >
                Email < /Label> <
                Input type = "text"
                name = "text"
                id = "username"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                FormGroup >
                <
                Label
                for = "password" > Password < /Label> <
                Input type = "password"
                name = "password"
                id = "password"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                FormGroup >
                <
                Label
                for = "confirmPassword" > Confirm Password < /Label> <
                Input type = "password"
                name = "confirmPassword"
                id = "confirmPassword"
                onChange = { this.onChange }
                /> <
                /FormGroup> <
                /Form> { /*<a href='/'>*/ } < Button color = 'info'
                onClick = { this.signUp } > Submit < /Button>{/ * < /a>*/
            } <
            /div>
    );
}
};

export default Signup;