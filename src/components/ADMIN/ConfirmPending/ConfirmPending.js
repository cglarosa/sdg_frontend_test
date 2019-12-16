import React, { Component } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MenuBar from '../MenuBar/MenuBar';

class ConfirmPending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoadingData: false,
            pendingUsers: [],
            activeUser: {},
            userModal: false
        }
    }

    componentDidMount() {
        this.setState({ isLoadingData: true });
        axios.get('https://warm-tundra-38403.herokuapp.com/users')
            .then(response => {
                this.setState({ users: response.data, isLoadingData: false });
                let pendingUsers = this.state.users.filter((item, i) => {
                    return item.pending;
                });
                this.setState({ pendingUsers: pendingUsers });
            })
    }

    confirmRequest = (username) => {
        axios.put('https://warm-tundra-38403.herokuapp.com/users/grant', [{
                username: username
            }])
            .then(response => {
                window.location.reload();
            })
    }

    openModal = (user) => {
        this.setState({ activeUser: user, userModal: true });
    }

    toggleUserModal = () => {
        this.setState({ userModal: !this.state.userModal });
    }

    deleteRequest = (user_id) => {
        console.log(user_id);
        axios.post('https://warm-tundra-38403.herokuapp.com/users/delete', [{
                username: user_id
            }])
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error.response.data);
            })
    }

    render() {
        return ( <
            div >
            <
            MenuBar / >
            <
            Container >
            <
            h3 > Confirm Pending Signup Requests < /h3> <
            hr / >
            <
            Modal isOpen = { this.state.userModal }
            toggle = { this.toggleUserModal }
            size = 'lg' >
            <
            ModalHeader toggle = { this.toggleUserModal } > User info({ this.state.activeUser.user_id }) < /ModalHeader> <
            ModalBody >
            <
            Table responsive borderless >
            <
            tbody >
            <
            tr >
            <
            th > Name < /th> <
            td > { this.state.activeUser.name } < /td> <
            /tr> <
            tr >
            <
            th > Primary Affiliation < /th> <
            td > { this.state.activeUser.primary_aff } < /td> <
            /tr> <
            tr >
            <
            th > Secondary Affiliation < /th> <
            td > { this.state.activeUser.secondary_aff } < /td> <
            /tr> <
            tr >
            <
            th > Highest Educational Attainment < /th> <
            td > { this.state.educ_attain === 'bachelor\'s degree' ? 'Bachelor\'s Degree' : this.state.educ_attain === "master's or professional degree" || this.state.educ_attain === "Masters" ? "Master's or Professional Degree" : "PhD Degree" } < /td> <
            /tr> <
            tr >
            <
            th > Acknowledge in Research Studies ? < /th> <
            td > { this.state.activeUser.acknowledge ? 'Yes' : 'No' } < /td> <
            /tr> <
            tr >
            <
            th > Email < /th> <
            td > { this.state.activeUser.username } < /td> <
            /tr> <
            tr >
            <
            th > Years of Experience < /th> <
            td > { this.state.activeUser.yrs_exp } < /td> <
            /tr> <
            tr >
            <
            th > Professor < /th> <
            td > { this.state.activeUser.contact_person } < /td> <
            /tr> <
            /tbody> <
            /Table> <
            /ModalBody> <
            ModalFooter >
            <
            Button color = "primary"
            onClick = { this.toggleUserModal } > Done < /Button> <
            /ModalFooter> <
            /Modal> {
                this.state.isLoadingData ?
                    <
                    Alert color = 'light' >
                    Loading data, please wait... <
                    /Alert> :
                    this.state.pendingUsers.length === 0 ?
                    <
                    Alert color = 'light' >
                    No pending signup requests. <
                    /Alert> :
                    <
                    Table responsive >
                    <
                    thead >
                    <
                    th > Name < /th> <
                    th > Email Address < /th> <
                    th > Professor < /th> <
                    th > Settings < /th> <
                    /thead> <
                    tbody > {
                        this.state.pendingUsers.sort((a, b) => a.contact_person.localeCompare(b.contact_person)).map((item, i) => {
                            if (item.pending) {
                                return ( <
                                    tr >
                                    <
                                    td > { item.name } < /td> <
                                    td > { item.username } < /td> <
                                    td > { item.contact_person } < /td> <
                                    td > < Button color = 'danger'
                                    onClick = {
                                        () => this.deleteRequest(item.username) } > Delete Request < /Button>{' '}<Button color='warning' onClick={() => this.openModal(item)}>View Details</Button > { ' ' } < Button color = 'success'
                                    onClick = {
                                        () => this.confirmRequest(item.username) } > Confirm Request < /Button></td >
                                    <
                                    /tr>
                                );
                            }
                            return null;
                        })
                    } <
                    /tbody> <
                    /Table>} <
                    /Container> <
                    /div>
            )
        }
    }

    export default ConfirmPending;