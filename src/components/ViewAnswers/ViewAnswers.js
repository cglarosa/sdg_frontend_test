import React, { Component } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink, Row, Col, Alert } from 'reactstrap';
import MenuBar from '../MenuBar/MenuBar';

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


class ViewAnswers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            pages: [],
            activePage: '1',
            bodyContents: [],
            isLoadingData: false
        };
    }

    componentWillMount() {
        this.setState({ isLoadingData: true });
        axios.post('https://warm-tundra-38403.herokuapp.com/survey/answers/user', [{
                username: localStorage.getItem('username')
            }])
            .then(response => {
                this.setState({ isLoadingData: false });
                console.log(response.data);
                this.setState({ answers: response.data }, () => {
                    this.state.answers.map((item) => {
                        this.getBody(item.target1_goal, item.target1_subgoal);
                        this.getBody(item.target2_goal, item.target2_subgoal);
                        return null;
                    })
                });
                let pages = [];
                for (let i = 1; i <= Math.ceil(response.data.length / 10); i++) {
                    pages.push(String(i));
                }
                this.setState({ pages: pages });
            })
    }

    setActivePage = (page) => {
        this.setState({ activePage: page });
    }

    colorStyle = (i) => {
        let color = colorScheme[i];
        return {
            color: color,
        }
    }

    getBody = (goal, subgoal) => {
        let bodyContents = this.state.bodyContents;
        let alreadyIncluded = false;
        axios.post('https://warm-tundra-38403.herokuapp.com/goals', [{
                goal_id: goal,
                subgoal_id: subgoal
            }])
            .then(response => {
                for (let i = 0; i < bodyContents.length; i++) {
                    if (bodyContents[i].goal === goal && bodyContents[i].subgoal === subgoal) {
                        alreadyIncluded = true;
                        break;
                    }
                }
                if (!alreadyIncluded) {
                    bodyContents.push({ goal: response.data.goal_id, subgoal: response.data.subgoal_id, body: response.data.body });
                    this.setState({ bodyContents: bodyContents });
                }
            });
    }

    render() {
        return ( <
            div >
            <
            MenuBar / >
            <
            Container >
            <
            h3 > View Survey Answers < /h3> <
            hr / > {
                this.state.isLoadingData ?
                <
                Alert color = "light" >
                Loading data,
                please wait... <
                /Alert> :
                    this.state.answers.length === 0 ?
                    <
                    Alert color = "light" >
                    You have not yet answered any survey question. <
                    /Alert> :
                    <
                    Pagination > {
                        this.state.pages.map((item) => {
                            return ( <
                                PaginationItem active = { this.state.activePage === item ? true : false } >
                                <
                                PaginationLink onClick = {
                                    () => this.setActivePage(item) } > { item } <
                                /PaginationLink> <
                                /PaginationItem>
                            )
                        })
                    } <
                    /Pagination>} <
                    ListGroup > {
                        this.state.answers.map((item, i) => {
                            if (i < parseInt(this.state.activePage) * 10 && i >= (parseInt(this.state.activePage) - 1) * 10) {
                                return ( <
                                    div >
                                    <
                                    ListGroupItem >
                                    <
                                    Row >
                                    <
                                    Col > < b > < span style = { this.colorStyle(item.target1_goal) } > { item.target1_goal + '.' + item.target1_subgoal } < /span></b > < /Col> <
                                    Col > {
                                        this.state.bodyContents.map((body) => {
                                            if (body.goal === item.target1_goal && body.subgoal === item.target1_subgoal) {
                                                return <div > { body.body } < /div>
                                            }
                                            return null;
                                        })
                                    } < /Col> <
                                    /Row> <
                                    hr / >
                                    <
                                    Row >
                                    <
                                    Col > < b > < span style = { this.colorStyle(item.target2_goal) } > { item.target2_goal + '.' + item.target2_subgoal } < /span></b > < /Col> <
                                    Col > {
                                        this.state.bodyContents.map((body) => {
                                            if (body.goal === item.target2_goal && body.subgoal === item.target2_subgoal) {
                                                return <div > { body.body } < /div>
                                            }
                                            return null;
                                        })
                                    } < /Col> <
                                    /Row> <
                                    hr / >
                                    <
                                    Row >
                                    <
                                    Col > < b > Score < /b></Col >
                                    <
                                    Col > { item.score } < /Col> <
                                    /Row> <
                                    hr / >
                                    <
                                    Row >
                                    <
                                    Col > < b > Comments / Insights < /b></Col >
                                    <
                                    Col > { item.reason === '' ? 'None' : item.reason } < /Col> <
                                    /Row> <
                                    /ListGroupItem> <
                                    br / >
                                    <
                                    /div>
                                )
                            }
                            return null;
                        })
                    } <
                    /ListGroup> <
                    /Container> <
                    /div>
            )
        }
    }

    export default ViewAnswers;