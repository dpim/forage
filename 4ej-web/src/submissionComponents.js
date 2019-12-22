import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Alert, Form, FormGroup, Button, InputGroup, InputGroupButton, Input, InputGroupAddon, Row, Col, Container } from 'reactstrap';


export class SubmissionContainer extends Component {
    constructor(){
    	super();
    	this.submit.bind(this);
    	this.validate.bind(this);
    	this.handleChange.bind(this);
    	this.onDismiss.bind(this);

    	this.state = {
            location: null,
            title: null,
            tags: null,
            file: null,
            didAcceptTerms: false,
            errorMessage: null,
            visible: false
        }
    }

    validate(){
    	let errorMessage = "Issues: ";
    	let parts = [];
    	if (!this.state.title || this.state.title.length == 0 || this.state.title.length > 40) {
    		parts.push("title is invalid");
    	}
    	if (!this.state.file || (this.state.file.size/1024/1024 > 100)){
    		parts.push("file is invalid");
    	}
    	if (this.state.tags && this.state.tags.length > 100){
    		parts.push("tags are invalid");
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

   	componentDidMount(){
   	}

   	handleChange(event){
   		const name = event.target.name;
   		const value = event.target.value;
   		if (name=="fileUpload"){
 			this.setState({location: value, file: event.target.files[0]});
   		} else if (name=="title"){
 			this.setState({title: value});
   		} else if (name=="tags"){
 			this.setState({tags: value});
   		} else {
   			//do nothing
   		}
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
    }

    render(){    	
        return(
            <div className="Page">
               <Container >
               <Row className="Page-row">
                    <Col lg="10" xl="6">
                        <h4>New submission</h4>
                    </Col>
                </Row>           
                <Form>
                    <FormGroup>
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
	                            <Input type="text" name="title" placeholder="document title" onChange={(event)=>this.handleChange(event)} />
	                        </Col>
	                     </Row>
                    </FormGroup>
                    <FormGroup>
	                    <Row className="Page-row">
                            <Col lg="10" xl="6">
							<input type="file" name="fileUpload" id="file" className="inputfile" accept=".pdf,.png" onChange={(event)=>this.handleChange(event)} />
               				{(this.state.location) ? 
               				<Button htmlFor="fileUpload">Selected: {this.state.location.split('fakepath\\')[1]}</Button> : <Button htmlFor="fileUpload">Choose a file</Button> } 	                        
                            </Col>
	                     </Row>
                    </FormGroup>
                    <FormGroup>
	                    <Row className="Page-row">
                                <Col lg="10" xl="6">
	                            <Input type="text" name="tags" placeholder="tags, tags, tags" onChange={(event)=>this.handleChange(event)}/>
	                        </Col>
	                     </Row>
                    </FormGroup>
                    <FormGroup>
	                    <Row className="Page-row">
                            <Col lg="10" xl="6">
	                                I agree to the <a href="/terms">terms</a> <Input addon type="checkbox" onChange={(event)=>this.handleCheckBoxChange(event)}/>
	                        </Col>
	                    </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row className="Page-row">
                             <Col lg="10" xl="6">
                                    <Button color="primary" onClick={()=>this.submit()}>Submit</Button>
                            </Col>
                        </Row>
                    </FormGroup>
                </Form>
                </Container>
            </div>
        );
    }
}