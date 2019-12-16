import React, { Component } from 'react';
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    Button,
    Alert,
    CardColumns,
    CardSubtitle,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { authenticate } from '../../actions/userActions';

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
class SelectGoal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleGoals: false,
            planetGoals: false,
            prosperityGoals: false,
            goal1tooltip: false,
            goals: [],
            peopleItems: ['1', '2', '3', '4', '5', '6'],
            planetItems: ['7', '9', '11', '13', '14', '15'],
            prosperityItems: ['8', '10', '12', '16', '17'],
            selectedGoals: [],
            loadingData: true,
            showModal: false,
            waitingSubmit: false
        };
    }

    togglePeopleGoals = () => {
        this.setState({ peopleGoals: !this.state.peopleGoals });
    }

    togglePlanetGoals = () => {
        this.setState({ planetGoals: !this.state.planetGoals });
    }

    toggleProsperityGoals = () => {
        this.setState({ prosperityGoals: !this.state.prosperityGoals });
    }

    onClick = (event) => {
        let goal_id = event.target.name;
        this.setState(prevState => {
            if (!this.state.selectedGoals.includes(goal_id)) {
                return { selectedGoals: [...prevState.selectedGoals, goal_id] };
            } else {
                let newSelected = prevState.selectedGoals.filter((item) => {
                    if (item === goal_id) {
                        return false;
                    }
                    return true;
                });
                return { selectedGoals: newSelected }
            }
        });
        console.log(this.state.selectedGoals);
    }

    componentWillMount() {
        axios.get('https://warm-tundra-38403.herokuapp.com/goals/all').then(
            response => {
                this.setState({
                    goals: response.data,
                    loadingData: false
                });
            }
        )
    }

    colorStyle = (bool, i) => {
        let color = colorScheme[i];
        if (bool) {
            return {
                backgroundColor: color,
                borderColor: color
            }
        } else {
            return {};
        }
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    submit = () => {
        this.setState({ waitingSubmit: true });
        this.state.selectedGoals.map((goal, i) => {
            if (i === this.state.selectedGoals.length - 1) {
                axios.post('https://warm-tundra-38403.herokuapp.com/users/add/sdg', [{
                    user_id: this.props.user_id.toString(),
                    goal_id: goal
                }]).then(response => {
                    this.props.authenticate(this.props.user_id);
                    this.setState({ waitingSubmit: false });
                    this.props.history.push('/survey');
                });
            } else {
                axios.post('https://warm-tundra-38403.herokuapp.com/users/add/sdg', [{
                    user_id: this.props.user_id.toString(),
                    goal_id: goal
                }]);
            }
            return true;
        });
    }

    render() {
            return ( <
                    div className = 'container' >
                    <
                    a href = '/' > Logout < /a> <
                    br / >
                    <
                    br / >
                    <
                    h3 > Select Goals < /h3> { /* <h4>Selected Goals: {this.state.selectedGoals.sort().map((item, i) => {return item + " "})}</h4> */ } {
                        this.state.loadingData ? < Alert color = "info" > Loading data, please wait... < /Alert> :  <
                            div >
                            <
                            Row >
                            <
                            Col xs = '9' >
                            <
                            CardColumns > {
                                this.state.goals.map((goal, i) => {
                                    if (goal.subgoal_id === '0') {
                                        return ( <
                                            Card className = 'clickable'
                                            id = { `goal${goal.goal_id}` }
                                            style = { this.colorStyle(this.state.selectedGoals.includes(goal.goal_id), goal.goal_id) }
                                            inverse = { this.state.selectedGoals.includes(goal.goal_id) } >
                                            <
                                            CardImg height = "10%"
                                            width = "10%"
                                            src = { require(`../../assets/Images/Goal${goal.goal_id}.png`) }
                                            alt = "Card image cap" / >
                                            <
                                            CardBody >
                                            <
                                            CardTitle > Goal { goal.goal_id } < /CardTitle> <
                                            Button onClick = { this.onClick }
                                            name = { goal.goal_id } > { this.state.selectedGoals.includes(goal.goal_id) ? "Unselect" : "Select" } < /Button> <
                                            /CardBody> <
                                            /Card>
                                        );
                                    } else {
                                        return false;
                                    }
                                })
                            } <
                            /CardColumns> <
                            /Col> <
                            Col xs = '3' >
                            <
                            Card >
                            <
                            CardBody >
                            <
                            CardTitle >
                            <
                            b > Selected Goals < /b> <br/ > {
                                this.state.selectedGoals.sort().map((item, i) => {
                                    if (i > 0) {
                                        return ", " + item;
                                    } else {
                                        return item;
                                    }
                                })
                            } <
                            /CardTitle> {
                                this.state.selectedGoals.length < 2 && < CardSubtitle > Please select a minimum of 2 goals to proceed. < /CardSubtitle>} {
                                    this.state.selectedGoals.length >= 2 && < Button color = 'success'
                                    onClick = { this.submit } > Proceed < /Button>} <
                                        br / >
                                        <
                                        br / > {
                                            this.state.waitingSubmit && < CardText > Confirming,
                                            please wait... < /CardText>} <
                                            /CardBody> <
                                            /Card> <
                                            br / >
                                            <
                                            Button color = 'info'
                                            onClick = { this.toggleModal }
                                            size = 'xs'
                                            block > Click here to learn more < br / > about the 17 SDGs < /Button> <
                                            /Col> <
                                            /Row> <
                                            /div>} <
                                            Modal isOpen = { this.state.showModal }
                                            toggle = { this.toggleModal }
                                            centered = { true }
                                            size = 'lg' >
                                            <
                                            ModalHeader toggle = { this.toggleModal } > Sustainable Development Goals < /ModalHeader> <
                                            ModalBody >
                                            <
                                            h5 > People Goals < /h5> <
                                            ListGroup >
                                            <
                                            ListGroupItem >
                                            <
                                            b > GOAL 1: No Poverty < /b> <
                                                p > < i > End poverty in all its forms everywhere. < /i></p >
                                                <
                                                /ListGroupItem> <
                                                ListGroupItem >
                                                <
                                                b > GOAL 2: Zero Hunger < /b> <
                                                p > < i > End hunger,
                                            achieve food security and improved nutrition,
                                            and promote sustainable agriculture. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 3: Good Health and Well - Being < /b> <
                                                p > < i > Ensure healthy lives and promote well - being
                                            for all at all ages. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 4: Quality Education < /b> <
                                                p > < i > Ensure inclusive and equitable quality education and promote life - long learning opportunities
                                            for all. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 5: Gender Equality < /b> <
                                                p > < i > Achieve gender equality and empower all women and girls. < /i></p >
                                                <
                                                /ListGroupItem> <
                                                ListGroupItem >
                                                <
                                                b > GOAL 6: Clean Water and Sanitation < /b> <
                                                p > < i > Ensure availability and sustainable management of water and sanitation
                                            for all. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            /ListGroup> <
                                            br / >
                                            <
                                            h5 > Planet Goals < /h5> <
                                            ListGroup >
                                            <
                                            ListGroupItem >
                                            <
                                            b > GOAL 7: Affordable and Clean Energy < /b> <
                                                p > < i > Ensure access to affordable,
                                            reliable,
                                            sustainable,
                                            and modern energy
                                            for all. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 9: Industry,
                                            Innovation and Infrastructure < /b> <
                                            p > < i > Build resilient infrastructure,
                                            promote inclusive and sustainable industrialization and foster innovation. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 11: Sustainable Cities and Communities < /b> <
                                                p > < i > Make cities and human settlements inclusive,
                                            safe,
                                            resilient and sustainable. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 13: Climate Action < /b> <
                                                p > < i > Take urgent action to combat climate change and its impacts,
                                            < b > Acknowledging < /b> that the United Nations Framework Convention on Climate Change is the primary international, intergovernmental forum for negotiating the global response to climate change.</i > < /p> <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 14: Life below Water < /b> <
                                                p > < i > Conserve and sustainably use the oceans,
                                            seas and marine resources
                                            for sustainable development. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 15: Life on Land < /b> <
                                                p > < i > Protect,
                                            restore,
                                            and promote sustainable use of terrestrial ecosystems,
                                            sustainably manage forests,
                                            combat desertification,
                                            and halt and reverse land degradation and halt biodiversity loss. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            /ListGroup> <
                                            br / >
                                            <
                                            h5 > Prosperity Goals < /h5> <
                                            ListGroup >
                                            <
                                            ListGroupItem >
                                            <
                                            b > GOAL 8: Decent Work and Economic Growth < /b> <
                                                p > < i > Promote sustained,
                                            inclusive,
                                            and sustainable economic growth,
                                            full and productive employment and decent work
                                            for all. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 10: Reduced Inequalities < /b> <
                                                p > < i > Reduce inequality within and among countries. < /i></p >
                                                <
                                                /ListGroupItem> <
                                                ListGroupItem >
                                                <
                                                b > GOAL 12: Responsible Consumption and Production < /b> <
                                                p > < i > Ensure sustainable consumption and production patterns. < /i></p >
                                                <
                                                /ListGroupItem> <
                                                ListGroupItem >
                                                <
                                                b > GOAL 16: Peace,
                                            Justice,
                                            and Strong Institutions < /b> <
                                            p > < i > Promote peaceful and inclusve societies
                                            for sustainable development,
                                            provide access to justice
                                            for all and build effective,
                                            accountable and inclusive institutions at all levels. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            ListGroupItem >
                                            <
                                            b > GOAL 17: Partnership
                                            for the Goals < /b> <
                                            p > < i > Strengthen the means of implementation and revitalize the global partnership
                                            for sustainable development. < /i></p >
                                            <
                                            /ListGroupItem> <
                                            /ListGroup> <
                                            /ModalBody> <
                                            ModalFooter >
                                            <
                                            Button color = "primary"
                                            onClick = { this.toggleModal } > Done < /Button> <
                                            /ModalFooter> <
                                            /Modal> <
                                            /div>
                                        );
                                }
                            }

                        const mapStateToProps = state => ({
                            user_id: state.user_id
                        });

                        const mapActionsToProps = {
                            authenticate: authenticate
                        };

                        export default connect(mapStateToProps, mapActionsToProps)(SelectGoal);