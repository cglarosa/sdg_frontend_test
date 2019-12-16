import React, { Component } from 'react';
import { Container, Row, Col, Jumbotron, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem, Button, Modal, ModalBody, ModalHeader, ModalFooter, Table } from 'reactstrap';
import axios from 'axios';
import MenuBar from '../MenuBar/MenuBar';

let GOALS = [{
        name: 'GOAL 1: No Poverty',
        colorScheme: '#EB1C2D',
        number: '1'
    },
    {
        name: 'GOAL 2: Zero Hunger',
        colorScheme: '#D3A029',
        number: '2'
    },
    {
        name: 'GOAL 3: Good Health and Well-Being',
        colorScheme: '#4CA146',
        number: '3'
    },
    {
        name: 'GOAL 4: Quality Education',
        colorScheme: '#C7212F',
        number: '4'
    },
    {
        name: 'GOAL 5: Gender Equality',
        colorScheme: '#EF402D',
        number: '5'
    },
    {
        name: 'GOAL 6: Clean Water and Sanitation',
        colorScheme: '#27BFE6',
        number: '6'
    },
    {
        name: 'GOAL 7: Affordable and Clean Energy',
        colorScheme: '#FBC412',
        number: '7'
    },
    {
        name: 'GOAL 8: Decent Work and Economic Growth',
        colorScheme: '#A31C44',
        number: '8'
    },
    {
        name: 'GOAL 9: Industry, Innovation and Infrastructure',
        colorScheme: '#F36D25',
        number: '9'
    },
    {
        name: 'GOAL 10: Reduced Inequalities',
        colorScheme: '#DD1367',
        number: '10'
    },
    {
        name: 'GOAL 11: Sustainable Cities and Communities',
        colorScheme: '#F89D2A',
        number: '11'
    },
    {
        name: 'GOAL 12: Responsible Consumption and Production',
        colorScheme: '#CF8D2A',
        number: '12'
    },
    {
        name: 'GOAL 13: Climate Action',
        colorScheme: '#48773E',
        number: '13'
    },
    {
        name: 'GOAL 14: Life below Water',
        colorScheme: '#1F97D4',
        number: '14'
    },
    {
        name: 'GOAL 15: Life on Land',
        colorScheme: '#3EB049',
        number: '15'
    },
    {
        name: 'GOAL 16: Peace, Justice, and Strong Institutions',
        colorScheme: '#136A9F',
        number: '16'
    },
    {
        name: 'GOAL 17: Partnership for the Goals',
        colorScheme: '#183668',
        number: '17'
    }
]

let colorScheme = {
    '1': '#EB1C2D',
    '2': '#D3A029',
    '3': '#4CA146',
    '4': '#C7212F',
    '5': '#EF402D',
    '6': '#27BFE6',
    '7': '#FBC412',
    '8': '#A31C44',
    '9': '#F36D25',
    '10': '#DD1367',
    '11': '#F89D2A',
    '12': '#CF8D2A',
    '13': '#48773E',
    '14': '#1F97D4',
    '15': '#3EB049',
    '16': '#136A9F',
    '17': '#183668'
}

class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstGoalDropdown: false,
            secondGoalDropdown: false,
            firstSubgoalDropdown: false,
            secondSubgoalDropdown: false,
            selectedFirstGoal: { name: '', number: 1 },
            selectedSecondGoal: { name: '', number: 1 },
            firstIndex: 0,
            secondIndex: 0,
            firstSubgoals: [],
            secondSubgoals: [],
            selectedFirstSubgoal: { subgoal_id: '0' },
            selectedSecondSubgoal: { subgoal_id: '0' },
            activeQuery: {
                target1_goal: '',
                target1_subgoal: '',
                target2_goal: '',
                target2_subgoal: '',
                score: 0,
                reason: '',
                username: ''
            },
            queryModal: false
        }
    }

    toggleFirstGoalDropdown = () => {
        this.setState({ firstGoalDropdown: !this.state.firstGoalDropdown });
    }

    toggleSecondGoalDropdown = () => {
        this.setState({ secondGoalDropdown: !this.state.secondGoalDropdown });
    }

    toggleFirstSubgoalDropdown = () => {
        this.setState({ firstSubgoalDropdown: !this.state.firstSubgoalDropdown });
    }

    toggleSecondSubgoalDropdown = () => {
        this.setState({ secondSubgoalDropdown: !this.state.secondSubgoalDropdown });
    }

    toggleQueryModal = () => {
        this.setState(prevState => ({
            queryModal: !prevState.queryModal,
        }));
    }

    colorStyle = (i) => {
        let color = colorScheme[i];
        return {
            color: color,
        }
    }

    selectGoal = (goal, order, index) => {
        switch (order) {
            case 'first':
                this.setState({ selectedFirstGoal: goal, firstIndex: index, selectedSecondGoal: { name: '', number: '1' }, secondSubgoals: [], selectedFirstSubgoal: { subgoal_id: '0' }, selectedSecondSubgoal: { subgoal_id: '0' } });
                axios.post('https://warm-tundra-38403.herokuapp.com/goals/sub', [{
                    goal_id: goal.number
                }]).then(response => {
                    this.setState({ firstSubgoals: response.data });
                });
                break;
            case 'second':
                this.setState({ selectedSecondGoal: goal, secondIndex: index, selectedSecondSubgoal: { subgoal_id: '0' } });
                axios.post('https://warm-tundra-38403.herokuapp.com/goals/sub', [{
                    goal_id: goal.number
                }]).then(response => {
                    this.setState({ secondSubgoals: response.data });
                });
                break;
            default:
                break;
        }
    }

    submit = () => {
        axios.post('https://warm-tundra-38403.herokuapp.com/survey/answer/single', [{
            target1_goal: this.state.selectedFirstSubgoal.goal_id,
            target1_subgoal: this.state.selectedFirstSubgoal.subgoal_id,
            target2_goal: this.state.selectedSecondSubgoal.goal_id,
            target2_subgoal: this.state.selectedSecondSubgoal.subgoal_id
        }]).then(response => {
            console.log(response.data);
            this.setState({ activeQuery: response.data, queryModal: true });
        }).catch(error => {
            this.setState({
                activeQuery: {
                    target1_goal: '',
                    target1_subgoal: '',
                    target2_goal: '',
                    target2_subgoal: '',
                    score: 0,
                    reason: '',
                    username: ''
                },
                queryModal: true
            });
        });
    }

    selectSubgoal = (subgoal, order) => {
        switch (order) {
            case 'first':
                console.log(subgoal.goal_id, subgoal.subgoal_id);
                this.setState({
                    selectedFirstSubgoal: subgoal,
                    activeQuery: {
                        target1_goal: '',
                        target1_subgoal: '',
                        target2_goal: '',
                        target2_subgoal: '',
                        score: 0,
                        reason: '',
                        username: ''
                    }
                });
                break;
            case 'second':
                console.log(subgoal.goal_id, subgoal.subgoal_id);
                this.setState({
                    selectedSecondSubgoal: subgoal,
                    activeQuery: {
                        target1_goal: '',
                        target1_subgoal: '',
                        target2_goal: '',
                        target2_subgoal: '',
                        score: 0,
                        reason: '',
                        username: ''
                    }
                });
                break;
            default:
                break;
        }
    }

    render() {
            return ( <
                    div >
                    <
                    MenuBar / >
                    <
                    Modal size = 'lg'
                    isOpen = { this.state.queryModal }
                    toggle = { this.toggleQueryModal } >
                    <
                    ModalHeader toggle = { this.toggleQueryModal } > {
                        this.state.activeQuery.username === '' ?
                        'Interaction Details' :
                            <
                            div >
                            <
                            span style = { this.colorStyle(this.state.activeQuery.target1_goal) } > { this.state.activeQuery.target1_goal + '.' + this.state.activeQuery.target1_subgoal } < /span> &{' '} <
                            span style = { this.colorStyle(this.state.activeQuery.target2_goal) } > { this.state.activeQuery.target2_goal + '.' + this.state.activeQuery.target2_subgoal } < /span> <
                            /div>
                    } <
                    /ModalHeader> <
                    ModalBody >
                    <
                    br / >
                    <
                    Table > {
                        this.state.activeQuery.username === '' ?
                        <
                        tbody >
                        <
                        p > This interaction / relationship has not yet been evaluated. < /p> <
                        /tbody> :
                            <
                            tbody >
                            <
                            tr >
                            <
                            th > Score < /th> <
                            td > { this.state.activeQuery.score } < /td> <
                            /tr> <
                            tr >
                            <
                            th > Insights / Comments < /th> <
                            td > { this.state.activeQuery.reason } < /td> <
                            /tr> <
                            /tbody>} <
                            /Table> <
                            /ModalBody> <
                            ModalFooter >
                            <
                            Button color = "success"
                        onClick = { this.toggleQueryModal } > Done < /Button> <
                        /ModalFooter> <
                        /Modal> <
                        Container >
                        <
                        h3 > Query Goals < /h3> <
                        hr / > {
                            this.state.selectedFirstSubgoal.subgoal_id !== '0' &&
                            this.state.selectedSecondSubgoal.subgoal_id !== '0' ?
                            <
                            div >
                            <
                            Button color = 'success'
                            onClick = { this.submit } > Submit < /Button>  <
                            br / >
                            <
                            br / >
                            <
                            /div> :
                                null
                        } <
                        Row >
                        <
                        Col >
                        <
                        ButtonDropdown isOpen = { this.state.firstGoalDropdown }
                        toggle = { this.toggleFirstGoalDropdown } >
                        <
                        DropdownToggle caret color = 'warning' > { this.state.selectedFirstGoal.name === '' ? 'Select Goal 1' : this.state.selectedFirstGoal.name } <
                        /DropdownToggle> <
                        DropdownMenu > {
                            GOALS.map((item, i) => {
                                    return ( < DropdownItem onClick = {
                                            () => this.selectGoal(item, 'first', i) } > { item.name } < /DropdownItem>);
                                    })
                            } <
                            /DropdownMenu> <
                            /ButtonDropdown> <
                            br / >
                            <
                            br / > {
                                this.state.selectedFirstGoal.name !== '' ?
                                <
                                Jumbotron >
                                <
                                img alt = 'goal1'
                                className = 'center'
                                height = "30%"
                                width = "30%"
                                src = { require(`../../assets/Images/Goal${this.state.selectedFirstGoal.number}.png`) }
                                /> <
                                br / >
                                <
                                span style = {
                                    { color: this.state.selectedFirstGoal.colorScheme } } > < h1 className = "display-5 centered" > Goal { this.state.selectedFirstGoal.number } < /h1></span >
                                <
                                ListGroup > {
                                    this.state.firstSubgoals.map((item) => {
                                            if (item.subgoal_id !== 'title' && item.subgoal_id !== '0') {
                                                return ( < ListGroupItem action className = 'clickable'
                                                    active = { this.state.selectedFirstSubgoal.subgoal_id === item.subgoal_id }
                                                    onClick = {
                                                        () => this.selectSubgoal(item, 'first') } > { item.subgoal_id }: { item.body } < /ListGroupItem>)
                                                }
                                                return null;
                                            })
                                    } <
                                    /ListGroup> <
                                    /Jumbotron>: ''
                                } <
                                /Col> <
                                Col >
                                <
                                ButtonDropdown isOpen = { this.state.secondGoalDropdown }
                                toggle = { this.toggleSecondGoalDropdown } >
                                <
                                DropdownToggle caret color = 'warning' > { this.state.selectedSecondGoal.name === '' ? 'Select Goal 2' : this.state.selectedSecondGoal.name } <
                                /DropdownToggle> <
                                DropdownMenu > {
                                    GOALS.map((item, i) => {
                                            if (i >= this.state.firstIndex) {
                                                return ( < DropdownItem onClick = {
                                                        () => this.selectGoal(item, 'second', i) } > { item.name } < /DropdownItem>);
                                                }
                                                return null;
                                            })
                                    } <
                                    /DropdownMenu> <
                                    /ButtonDropdown> <
                                    br / >
                                    <
                                    br / > {
                                        this.state.selectedSecondGoal.name !== '' ? < Jumbotron >
                                        <
                                        img alt = 'goal2'
                                        className = 'center'
                                        height = "30%"
                                        width = "30%"
                                        src = { require(`../../assets/Images/Goal${this.state.selectedSecondGoal.number}.png`) }
                                        /> <
                                        br / >
                                        <
                                        span style = {
                                            { color: this.state.selectedSecondGoal.colorScheme } } > < h1 className = "display-5 centered" > Goal { this.state.selectedSecondGoal.number } < /h1></span >
                                        <
                                        ListGroup > {
                                            this.state.secondSubgoals.map((item) => {
                                                    if (item.subgoal_id !== 'title' && item.subgoal_id !== '0') {
                                                        return ( < ListGroupItem action className = 'clickable'
                                                            active = { this.state.selectedSecondSubgoal.subgoal_id === item.subgoal_id }
                                                            onClick = {
                                                                () => this.selectSubgoal(item, 'second') } > { item.subgoal_id }: { item.body } < /ListGroupItem>)
                                                        }
                                                        return null;
                                                    })
                                            } <
                                            /ListGroup> <
                                            /Jumbotron>: ''} <
                                            /Col> <
                                            /Row> <
                                            /Container> <
                                            /div>
                                        );
                                    }
                                }

                                export default Query;