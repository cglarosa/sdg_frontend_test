import React, { Component } from 'react';
import { Container, Table, Alert, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import MenuBar from '../MenuBar/MenuBar';
import axios from 'axios';

class ViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            search: [],
            isLoadingData: false,
            infoModal: false,
            activeUser: { name: '' },
            search_query: ''
        }
    }

    componentDidMount() {
        this.setState({ isLoadingData: true });
        axios.get('https://warm-tundra-38403.herokuapp.com/users')
            .then(response => {
                this.setState({ users: response.data, search: response.data, isLoadingData: false });
            })
    }

    toggleInfoModal = (user) => {
        this.setState(prevState => ({
            infoModal: !prevState.infoModal,
            activeUser: user
        }));
    }

    search = (event) => {
        let query = event.target.value;
        this.setState({ search_query: query });
        console.log(query);

        if (query === '') {
            this.setState({ search: this.state.users });
        } else {
            this.setState({
                search: this.state.users.filter(item => {
                    let name = item.name.toLowerCase();
                    let email = item.username;
                    query = query.toLowerCase();

                    return (name.includes(query) || email.includes(query));
                })
            });
        }
    }

    /**
     * Up next: 
     * 1. add search bar *DONE* 
     * 2. implement reset password *DONE* 
     * 3. implement delete user *DONE* 
     * 
     */

    deleteUser = () => {
        axios.post('https://warm-tundra-38403.herokuapp.com/users/delete/cascade', [{
            username: this.state.activeUser.username,
            user_id: this.state.activeUser.user_id
        }]).then(response => {
            window.location.reload();
        });
        console.log({
            username: this.state.activeUser.username,
            user_id: this.state.activeUser.user_id
        });
    }

    resetPassword = () => {
        axios.post('https://warm-tundra-38403.herokuapp.com/users/change/password', [{
            username: this.state.activeUser.username,
            new_password: 'password'
        }]).then(response => {
            window.location.reload();
            console.log(response.data);
        })
    }

    render() {
        return ( <
            div >
            <
            MenuBar / >
            <
            Modal size = 'lg'
            isOpen = { this.state.infoModal }
            toggle = { this.toggleInfoModal } >
            <
            ModalHeader toggle = { this.toggleInfoModal } > { this.state.activeUser.name } < /ModalHeader> <
            ModalBody >
            <
            Button color = 'warning'
            onClick = { this.resetPassword } > Reset Password < /Button>{' '}<Button color='danger' onClick={this.deleteUser}>Delete User</Button >
            <
            br / >
            <
            br / >
            <
            Table >
            <
            tbody >
            <
            tr >
            <
            th > Name < /th> <
            td > { this.state.activeUser.name } < /td> < /
            tr > <
            tr >
            <
            th > Email < /th> <
            td > { this.state.activeUser.username } < /td> < /
            tr > <
            tr >
            <
            th > Primary Affiliation < /th> <
            td > { this.state.activeUser.primary_aff } < /td> < /
            tr > <
            tr >
            <
            th > Secondary Affiliation < /th> <
            td > { this.state.activeUser.secondary_aff } < /td> < /
            tr > <
            tr >
            <
            th > Point Person < /th> <
            td > { this.state.activeUser.contact_person } < /td> < /
            tr > <
            tr >
            <
            th > Highest Educational Attainment < /th> <
            td > { this.state.activeUser.educ_attain === 'bachelor\'s degree' ? 'Bachelor\'s Degree' : this.state.activeUser.educ_attain === "master's or professional degree" ? "Master's or Professional Degree" : 'PhD Degree' } < /td> < /
            tr > <
            tr >
            <
            th > Years of Experience in the field of SDGs < /th> <
            td > { this.state.activeUser.yrs_exp } < /td> < /
            tr > <
            /tbody> < /
            Table > <
            /ModalBody> <
            ModalFooter >
            <
            Button color = "success"
            onClick = { this.toggleInfoModal } > Done < /Button> < /
            ModalFooter > <
            /Modal> <
            Container >
            <
            h3 > View Registered Users < /h3> <
            hr / > {
                this.state.isLoadingData ?
                <
                Alert color = 'light' >
                Loading data,
                please wait... <
                /Alert> : <
                div >
                <
                FormGroup >
                <
                Input type = 'text'
                name = 'search_query'
                placeholder = 'Search Users (by name/email)'
                onChange = { this.search }
                value = { this.state.search_query }
                /> < /
                FormGroup > <
                Table responsive >
                <
                thead >
                <
                tr >
                <
                th > Name < /th> <
                th > Email < /th> <
                th > Professor < /th> <
                th > < /th> < /
                tr > <
                /thead> <
                tbody > {
                    this.state.search.map((item, i) => {
                        if (!item.pending) {
                            return ( <
                                tr >
                                <
                                td > { item.name } < /td> <
                                td > { item.username } < /td> <
                                td > { item.contact_person } < /td> <
                                td > < Button color = 'warning'
                                onClick = {
                                    () => this.toggleInfoModal(item)
                                } > View Details < /Button></td >
                                <
                                /tr>
                            );
                        }
                        return null;
                    })
                } <
                /tbody> < /
                Table > <
                /div>
            } <
            /Container> < /
            div >
        );
    }
}

export default ViewUsers;