import React, { Component } from 'react';
import { Container, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge, Tooltip, Alert, UncontrolledCollapse } from 'reactstrap';
// import MenuBar from '../MenuBar/MenuBar';
import { Graph } from 'react-d3-graph';
import axios from 'axios';

const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        size: 500,
        highlightStrokeColor: 'black'
    },
    link: {
        highlightColor: 'black',
        renderLabel: true
    },
    staticGraph: false,
    width: 1100,
    height: 500
};

let VALUE = 0;
let GOALS = [{
        name: 'GOAL 1: No Poverty',
        targets: '7',
        number: '1'
    },
    {
        name: 'GOAL 2: Zero Hunger',
        targets: '8',
        number: '2'
    },
    {
        name: 'GOAL 3: Good Health and Well-Being',
        targets: '13',
        number: '3'
    },
    {
        name: 'GOAL 4: Quality Education',
        targets: '10',
        number: '4'
    },
    {
        name: 'GOAL 5: Gender Equality',
        targets: '9',
        number: '5'
    },
    {
        name: 'GOAL 6: Clean Water and Sanitation',
        targets: '8',
        number: '6'
    },
    {
        name: 'GOAL 7: Affordable and Clean Energy',
        targets: '5',
        number: '7'
    },
    {
        name: 'GOAL 8: Decent Work and Economic Growth',
        targets: '12',
        number: '8'
    },
    {
        name: 'GOAL 9: Industry, Innovation and Infrastructure',
        targets: '8',
        number: '9'
    },
    {
        name: 'GOAL 10: Reduced Inequalities',
        targets: '10',
        number: '10'
    },
    {
        name: 'GOAL 11: Sustainable Cities and Communities',
        targets: '10',
        number: '11'
    },
    {
        name: 'GOAL 12: Responsible Consumption and Production',
        targets: '11',
        number: '12'
    },
    {
        name: 'GOAL 13: Climate Action',
        targets: '5',
        number: '13'
    },
    {
        name: 'GOAL 14: Life below Water',
        targets: '10',
        number: '14'
    },
    {
        name: 'GOAL 15: Life on Land',
        targets: '12',
        number: '15'
    },
    {
        name: 'GOAL 16: Peace, Justice, and Strong Institutions',
        targets: '12',
        number: '16'
    },
    {
        name: 'GOAL 17: Partnership for the Goals',
        targets: '19',
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

let linkColor = {
        '3': '#5CAEC8',
        '2': '#9BC9DD',
        '1': '#D0E2EC',
        '0': 'gray',
        '-1': '#F7D1C4',
        '-2': '#F1B09E',
        '-3': '#ED7F6E'
    }
    // graph event callbacks
const onClickNode = function(nodeId) {
    axios.post('https://warm-tundra-38403.herokuapp.com/goals/body', [{
        goal_id: nodeId.split('.')[0],
        subgoal_id: nodeId.split('.')[1]
    }]).then(response => {
        console.log(response.data);
        window.alert(`${nodeId}: ${response.data}`);
    });
};

const onRightClickNode = function(event, nodeId) {
    window.alert(`Right clicked node ${nodeId}`);
};


const onRightClickLink = function(event, source, target) {
    window.alert(`Right clicked link between ${source} and ${target}`);
};


class GraphPublic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalLinks: 1,
            switch: false,
            tooltipOpen: false,
            data: {
                nodes: [{ id: 'Master Node', color: 'black' }],
                links: []
            },
            selectedFirstGoal: { name: '', number: 1 },
            selectedSecondGoal: { name: '', number: 1 },
            firstGoalDropdown: false,
            secondGoalDropdown: false,
            forQuery: []
        }
    }

    /**
     * yellow green blue, positive
     * gray: 0
     * orange, red orange, red, negative
     */

    addToList = (goal) => {
        let forQuery = this.state.forQuery;
        let alreadyExists = false;
        let sum = 0;
        for (let i = 0; i < forQuery.length; i++) {
            if (forQuery[i].number === goal.number) {
                alreadyExists = true;
                break;
            }
        }
        if (!alreadyExists) {
            forQuery.push(goal);
        }
        for (let i = 0; i < forQuery.length; i++) {
            sum += parseInt(forQuery[i].targets, 10);
        }
        this.setState({ forQuery: forQuery, totalLinks: (sum * (sum - 1)) / 2 });
    }

    removeFromList = (goal) => {
        let forQuery = this.state.forQuery;
        let sum = 0;
        for (let i = 0; i < forQuery.length; i++) {
            if (forQuery[i].number !== goal.number)
                sum += parseInt(forQuery[i].targets, 10);
        }
        this.setState({
            forQuery: forQuery.filter(item => {
                return !(goal.number === item.number)
            }),
            totalLinks: (sum * (sum - 1)) / 2
        });

    }

    toggleFirstGoalDropdown = () => {
        this.setState({ firstGoalDropdown: !this.state.firstGoalDropdown });
    }

    toggleSecondGoalDropdown = () => {
        this.setState({ secondGoalDropdown: !this.state.secondGoalDropdown });
    }

    toggleTooltip = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    onClickLink = (source, target) => {
        axios.post('https://warm-tundra-38403.herokuapp.com/survey/answer/single', [{
            target1_goal: source.split('.')[0],
            target1_subgoal: source.split('.')[1],
            target2_goal: target.split('.')[0],
            target2_subgoal: target.split('.')[1]
        }]).then(response => {
            console.log(response.data);
            window.alert(`${source} & ${target}: (${response.data.score}) ${response.data.reason}`);
        }).catch(error => {
            axios.post('https://warm-tundra-38403.herokuapp.com/survey/answer/single', [{
                target1_goal: target.split('.')[0],
                target1_subgoal: target.split('.')[1],
                target2_goal: source.split('.')[0],
                target2_subgoal: source.split('.')[1]
            }]).then(response => {
                console.log(response.data);
                window.alert(`${source} & ${target}: (${response.data.score}) ${response.data.reason}`);
            }).catch(error => {
                window.alert(`${source} & ${target}: Not yet evaluated`)
            });
        });
    };

    fetchInteractions = () => {
        let data = this.state.data;
        window.alert('Loading data, please wait...');
        for (let j = 0; j < data.links.length; j++) {
            axios.post('https://warm-tundra-38403.herokuapp.com/survey/answer/single', [{
                target1_goal: data.links[j].source.split('.')[0],
                target1_subgoal: data.links[j].source.split('.')[1],
                target2_goal: data.links[j].target.split('.')[0],
                target2_subgoal: data.links[j].target.split('.')[1]
                    // eslint-disable-next-line
            }]).then(response => {
                data.links[j].color = linkColor[response.data.score];
                data.links[j].label = response.data.score;
                console.log(`${j} / ${data.links.length} done.`);
                VALUE += 1;
                this.setState({ data });
                // eslint-disable-next-line
            }).catch(error => {
                axios.post('https://warm-tundra-38403.herokuapp.com/survey/answer/single', [{
                    target1_goal: data.links[j].target.split('.')[0],
                    target1_subgoal: data.links[j].target.split('.')[1],
                    target2_goal: data.links[j].source.split('.')[0],
                    target2_subgoal: data.links[j].source.split('.')[1]
                }]).then(response => {
                    data.links[j].color = linkColor[response.data.score];
                    data.links[j].label = response.data.score;
                    console.log(`${j} / ${data.links.length} done.`);
                    VALUE += 1;
                    this.setState({ data });
                }).catch(error => {
                    data.links[j].color = 'gray';
                    VALUE += 1;
                    console.log(`${j} / ${data.links.length} done.`);
                    this.setState({ data });
                });
            });
        }
    }

    resetGraph = () => {
        this.setState({
            data: {
                nodes: [{ id: 'Master Node', color: 'black' }],
                links: []
            },
            forQuery: [],
            totalLinks: 1
        });
        VALUE = 0;
    }

    generateGraph = () => {
        let forQuery = this.state.forQuery;
        for (let x = 0; x < forQuery.length; x++) {
            axios.post('https://warm-tundra-38403.herokuapp.com/goals/sub', [{
                goal_id: forQuery[x].number
            }]).then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].subgoal_id !== 'title' && data[i].subgoal_id !== '0') {
                        this.state.data.nodes.push({ id: data[i].goal_id + '.' + data[i].subgoal_id, color: colorScheme[data[i].goal_id] });
                        if (this.state.data.nodes[0].id === 'Master Node') {
                            console.log(this.state.data.nodes.shift());
                        }
                        if (this.state.data.nodes.length > 1) {
                            for (let j = 0; j < this.state.data.nodes.length - 1; j++) {
                                this.state.data.links.push({ source: this.state.data.nodes[this.state.data.nodes.length - 1].id, target: this.state.data.nodes[j].id });
                            }
                        }
                    }
                }
                this.setState({ firstSubgoals: response.data, config: myConfig });
            });
            if (x === forQuery.length - 1) {
                this.setState({ forQuery: [] });
            }
        }
    }

    render() {
            return ( <
                    div > { /* <MenuBar/> */ } <
                    Container >
                    <
                    h3 > Graph Query < /h3> <
                    Button color = "success"
                    outline href = '/' > { '<' }
                    Back to home <
                    /Button> { ' ' } <
                    Button color = "info"
                    id = "toggler" >
                    Help <
                    /Button> <
                    UncontrolledCollapse toggler = "#toggler" >
                    <
                    hr / >
                    <
                    h5 > Directions < /h5> <
                    ol >
                    <
                    li > Click the 'Add Goals'
                    dropdown button to start adding goals to the graph, where a minimum of one(1) goal and a maximum of two goals(2) can be added to the graph.You may click the 'X'
                    button beside the goal to remove it from your chosen goals. < /li> <
                    li > Click the 'Generate Graph'
                    button to generate the graph given your choice of goals ' targets as the nodes, and their interactions as links. <
                    ul >
                    <
                    li > Drag the screen to move the view around. < /li> <
                    li > Scroll forward using the mouse to zoom into the graph, and scroll backward to zoom out. < /li> <
                    li > You may click the node to be able to know more about the certain target it holds. < /li> <
                    li > You may move and rearrange the nodes by dragging a node to a certain position. < /li> <
                    li > You may click the link between the two nodes to be able to know more about the certain interaction it holds, i.e.the score of their interactions and the insights of the researchers who scored that interaction. < /li> <
                    /ul> <
                    /li> <
                    li > Click the 'Fetch Goal Interactions'
                    button to color the links with their corresponding color depending on the score given to the interaction(link) between the two subgoal targets. <
                    ul >
                    <
                    li > When fetching the goal interactions, kindly wait
                    for the links to be colored one by one as the whole process can be slow especially when there are a lot of links currently present. < /li> <
                    /ul> <
                    /li> <
                    li > Click the 'Reset Graph'
                    button to generate a new graph with new goals. < /li> <
                    /ol>

                    <
                    /UncontrolledCollapse> <
                    hr / > {
                        this.state.totalLinks > 1 ? < Alert color = 'light' >
                        Total Links / Interactions / Edges : { this.state.totalLinks } < br / >
                        Total Colored Edges: { VALUE }
                        / {this.state.data.links.length} <
                        /Alert> : null} <
                        h4 > {
                            this.state.forQuery.map(item => {
                                    return ( < Badge color = 'success' > { item.name }({ item.targets }
                                            targets) < Button onClick = {
                                            () => this.removeFromList(item) }
                                        close / > < /Badge>);
                                    })
                            } <
                            /h4> {
                                this.state.data.links.length === 0 ? < ButtonDropdown isOpen = { this.state.firstGoalDropdown }
                                toggle = { this.toggleFirstGoalDropdown } >
                                    <
                                    DropdownToggle disabled = { this.state.forQuery.length === 2 ? true : false }
                                caret color = 'warning' >
                                    Add Goal <
                                    /DropdownToggle> <
                                    DropdownMenu > {
                                        GOALS.map((item, i) => {
                                                return ( < DropdownItem onClick = {
                                                        () => this.addToList(item) } > { item.name }({ item.targets }
                                                        targets) < /DropdownItem>);
                                                })
                                        } <
                                        /DropdownMenu> <
                                        /ButtonDropdown> : null}{' '} { ' ' } <
                                        Button color = 'danger'
                                        onClick = { this.resetGraph } > Reset Graph < /Button>{' '} {
                                            this.state.forQuery.length > 0 && this.state.data.links.length === 0 ? < Button color = 'success'
                                            onClick = { this.generateGraph } > Generate Graph < /Button> : null}{' '} {
                                                this.state.data.links.length > 0 && this.state.data.links[0].color === undefined ? < Button id = "TooltipInfo"
                                                color = 'info'
                                                onClick = { this.fetchInteractions } > Fetch Goal Interactions < /Button>:null} {
                                                    this.state.data.links.length > 0 && this.state.data.links[0].color === undefined ? < Tooltip placement = "top"
                                                    isOpen = { this.state.tooltipOpen }
                                                    target = "TooltipInfo"
                                                    toggle = { this.toggleTooltip } >
                                                        Colors the links with their corresponding color depending on the score given on the interaction(link) between the two subgoal targets. <
                                                        /Tooltip> : null} <
                                                        br / >
                                                        <
                                                        br / >
                                                        <
                                                        div className = 'graphBox' >
                                                        <
                                                        Graph
                                                    id = "graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                                                    data = { this.state.data }
                                                    config = { myConfig }
                                                    onClickNode = { onClickNode }
                                                    onRightClickNode = { onRightClickNode }
                                                    onClickLink = { this.onClickLink }
                                                    onRightClickLink = { onRightClickLink }
                                                    /> <
                                                    /div> <
                                                    /Container> <
                                                    /div>
                                                );
                                            }
                                        }

                                        export default GraphPublic;