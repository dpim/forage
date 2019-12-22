import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Alert, Jumbotron, Button, InputGroup, InputGroupButton, Input, InputGroupAddon, Row, Col, Container } from 'reactstrap';

export class LoginContainer extends Component {
    render(){
        return (
            <div className="Jumbo-wrapper">
            <Jumbotron>
                <h3 className="display-5">Something special awaits...</h3>
                <p className="lead">Share knowledge with the world</p>
                <p className="lead">
                    <Button href="/register" color="primary" className="Jumbo-button">Create account</Button>
                    <Button href="/existing" color="secondary" className="Jumbo-button">Sign in</Button>
                </p>
            </Jumbotron>
            </div>
        );
    }
}

export class RegisterContainer extends Component {
    constructor(){
        super();
        this.submit.bind(this);
        this.validate.bind(this);
        this.handleChange.bind(this);
        this.state = {
            username: null,
            email: null,
            password: null,
            didAcceptTerms: false,
            errorMessage: null, 
            visible: false
        }
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        let obj = {};
        obj[name] = value;
        this.setState(obj);
    }

    handleCheckBoxChange(event){
        if (this.state.didAcceptTerms){
            this.setState({didAcceptTerms: false})
        } else {
            this.setState({didAcceptTerms: true})
        }
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    submit(){
        this.validate();
        console.log("submitted")
        console.log(this.state);
    }

    validate(){
        let errorMessage = "Issues: ";
        let parts = [];
        if (!this.state.username || this.state.username.length > 100) { //make check it is not in use
            parts.push("username is invalid");
        }
        if (!this.state.password || this.state.password.length > 100){
            parts.push("password is invalid");
        }
        if (this.state.email && this.state.email.length > 100){
            parts.push("email is invalid");
        }
        if (!this.state.didAcceptTerms){
            parts.push("you must accept the terms of service");
        }
        errorMessage += parts.join(", ");
        if (parts.length > 0){
            this.setState({
                errorMessage: errorMessage,
                visible: true
            });
        } else {
            this.setState({
                errorMessage: null
            });
        }
    }
    
    render(){
        return (
            <div className="Page">
                <Container>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                            <h4>Good to meet you</h4>
                        </Col>
                    </Row> 
                     {(this.state.errorMessage) 
                        ?
                        <Row className="Page-row">
                            <Col lg="10" xl="6">
                                <Alert className="Validation-err" color="danger" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
                                   <strong>{this.state.errorMessage}</strong> 
                                </Alert>
                            </Col>
                         </Row> 
                         : <Row></Row>
                    }
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                        <InputGroup>
                            <InputGroupAddon>@</InputGroupAddon>
                            <Input placeholder="username" name="username" onChange={(event)=>this.handleChange(event)}/>
                          </InputGroup>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                        <InputGroup>
                            <Input placeholder="email" name="email" onChange={(event)=>this.handleChange(event)}/>
                          </InputGroup>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                        <InputGroup>
                            <Input type="password" name="password" placeholder="password" onChange={(event)=>this.handleChange(event)}/>
                          </InputGroup>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                                I agree to the <a href="/terms">terms</a> <Input addon type="checkbox" onChange={(event)=>this.handleCheckBoxChange(event)}/>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                                <Button color="primary"  onClick={()=>this.submit()}>Register</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export class ExistingContainer extends Component {
  constructor(){
        super();
        this.submit.bind(this);
        this.validate.bind(this);
        this.handleChange.bind(this);
        this.state = {
            email: null,
            password: null,   
            errorMessage: null, 
            visible: false
        }
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        let obj = {};
        obj[name] = value;
        this.setState(obj);
    }

    submit(){
        this.validate();
        console.log("submitted")
        console.log(this.state);
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    validate(){
        let errorMessage = "Issues: ";
        let isValidLogin = false;
        //make req
        if (!isValidLogin){
            this.setState({
                errorMessage: "Issue: Incorrect login details",
                visible: true
            });
        } else {
            this.setState({
                errorMessage: null
            });
        }
    }
    
    render(){
        return (
              <div className="Page">
                <Container>
                    <Row className="Page-row">
                    <Col lg="10" xl="6">
                        <h4>Welcome back</h4>
                    </Col>
                    </Row> 
                     {(this.state.errorMessage) 
                        ?
                        <Row className="Page-row">
                            <Col lg="10" xl="6">
                                <Alert className="Validation-err" color="danger" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
                                   <strong>{this.state.errorMessage}</strong> 
                                </Alert>
                            </Col>
                         </Row> 
                         : <Row></Row>
                    }
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                        <InputGroup>
                            <Input placeholder="email" name="email" onChange={(event)=>this.handleChange(event)}/>
                          </InputGroup>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                        <InputGroup>
                            <Input type="password" name="password" placeholder="password" onChange={(event)=>this.handleChange(event)}/>
                          </InputGroup>
                        </Col>
                    </Row>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                                <Button color="primary" onClick={()=>this.submit()}>Sign in</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
