import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Alert, Button, Input, InputGroup, InputGroupButton, Form, FormGroup, Label, Container, Row, Col } from 'reactstrap';

export class Menu extends Component {
    render(){
        return <div>{this.props.pages.map( (title,idx) => <span key={idx}> 
            <Link className="Menu-link" to={"/"+title}>{title}</Link> </span>)}</div>            
    }
}

export class Description extends Component {
      render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.text }} />
        );
      }
}

export class ForageSearch extends Component {
    render(){
        return (
            <div className="Search-wrapper">
                <Container>
                    <Row>
                        <Col lg="12">
                            <InputGroup className="Search-term">
                                <Input type="text" name="searchTerm" placeholder="what are you looking for?" onChange={()=>console.log('typing...')} />
                                <InputGroupButton><Button color="primary" onClick={()=>console.log('clicked')}>Search</Button></InputGroupButton>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export class ContactContainer extends Component {
    constructor(){
        super();
        this.submit.bind(this);
        this.onDismiss.bind(this);
        this.state = {
            email: null,
            text: null,
            submitted: false,
            visible: true
        }
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        let obj = {};
        obj[name] = value;
        this.setState(obj);
        this.setState({
            submitted: false,
            visible: true
        });
    }

    submit(){
        //submit
        //then...
        this.setState({
            submitted: true
        });
    }

    onDismiss() {
        this.setState({ 
            visible: false 
        });
    }

    render(){
        return(
            <div className="Page">
               <Container >  
                <Row className="Page-row">
                    <Col lg="10" xl="6">
                        <h4>We appreciate your feedback</h4>
                    </Col>
                </Row>                             
                <Form>
                   {(this.state.submitted) 
                        ?
                        <Row className="Page-row">
                            <Col lg="10" xl="6">
                                <Alert className="Validation-err" color="info" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
                                   <strong> Thanks for reaching out! Your feedback has been received. </strong>
                                </Alert>
                            </Col>
                         </Row> 
                         : <Row></Row>
                    }    
                    <FormGroup>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                            <Input type="email" name="email" placeholder="your email" onChange={(event)=>this.handleChange(event)}/>
                        </Col>
                     </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row className="Page-row">
                        <Col lg="10" xl="6">
                            <Input type="textarea" name="text" placeholder="what do you think?" onChange={(event)=>this.handleChange(event)}/>
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

export class ForageContainer extends Component {
    render(){
        return (
            <div>
                <div>
                    <ForageSearch />
                </div>
                <ForageCanvas />
            </div>
        );
    }
}

export class ForageCanvas extends Component {
    constructor(){
        super();
        this.handleResize.bind(this);
        this.setUpCanvas.bind(this);
        this.navigateToFocus.bind(this);
        this.fillCell.bind(this);
        this.state = {
            wrapperHeight: null,
            wrapperWidth: null,
            focalX: 25,//this.refs.focalHeight,
            focalY: 25,//this.refs.focalWidth,
            canvasWidth: 2020,
            canvasHeight: 2020,
            dragging: false,
            lastX: 0,
            lastY: 0,
            marginLeft: 0,
            marginTop: 0,
        }

    }

    addGridLines(context, zoom){
        let height = this.state.canvasHeight;
        let width = this.state.canvasWidth;
        var canvasHeight = height*(1/zoom);
        var canvasWidth = width*(1/zoom);
        var pad = 10;
        var adjustedWidth = canvasWidth+pad*2+1;
        var adjustedHeight = canvasHeight+pad*2+1;
        for (let x = 0; x <= adjustedWidth; x+=50){
            context.moveTo(0.5+x+pad, pad);
            context.lineTo(0.5+x+pad, canvasHeight-pad);
        }
         for (let y = 0; y <= adjustedWidth; y+=50){
            context.moveTo(pad, 0.5+y+pad);
            context.lineTo(canvasWidth-pad,0.5+y+pad);
        }
        context.strokeStyle = "white"
        context.stroke();
    }
    
    handleResize(e) {
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;
        this.setState({
            wrapperHeight: this.refs.canvasWrapper.clientHeight,
            wrapperWidth: this.refs.canvasWrapper.clientWidth,
            test: true
        });    
    }

    handleMouseDown(e){
        this.setState({
            dragging: true,
            lastX: e.clientX,
            lastY: e.clientY
        });
        e.preventDefault();
    }

    handleMouseMove(e){
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;
        let height = this.state.canvasHeight;
        let width = this.state.canvasWidth;
        let lastX = this.state.lastX;
        let lastY = this.state.lastY;
        let marginLeft = this.state.marginLeft;
        let marginTop = this.state.marginTop;
        if (this.state.dragging) {
            let clientX = (e.clientX) ? e.clientX : 0;
            let clientY = (e.clientY) ? e.clientY : 0;
            var deltaX = clientX - lastX;
            var deltaY = clientY - lastY;
            lastX = clientX;
            lastY = clientY;
            marginLeft += deltaX;
            marginTop += deltaY;
            if (marginLeft < 0){
                if (Math.abs(marginLeft) > width-this.state.wrapperWidth){
                    canvas.style.marginLeft = -(width-this.state.wrapperWidth)+"px";
                } else {
                    canvas.style.marginLeft = marginLeft+"px";
                }
            } else {
                canvas.style.marginLeft =  "0px";
            }            
            if (marginTop < 0){
                if (Math.abs(marginTop) > height-this.state.wrapperHeight){
                    canvas.style.marginTop = -(height-this.state.wrapperHeight)+"px";
                } else {
                    canvas.style.marginTop = marginTop+"px";
                }
            } else {
                canvas.style.marginTop =  "0px";
            }     
        }
        this.setState({
            marginLeft: marginLeft,
            marginTop: marginTop,
            lastX: lastX,
            lastY: lastY
        })
        e.preventDefault();
    }

    handleMouseUp(e){
      this.setState({
            dragging: false
        });
    }

    componentDidMount(){
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;
        this.setState({
            wrapperHeight: this.refs.canvasWrapper.clientHeight,
            wrapperWidth: this.refs.canvasWrapper.clientWidth,
            test: true
        }, () => {
            this.setUpCanvas();
        });
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    navigateToFocus(){
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;

        this.fillCell(10+50*this.state.focalX, 10+50*this.state.focalY)
        const offsetX = Math.max(0, 50*this.state.focalX-this.state.wrapperWidth/2);
        const offsetY = Math.max(0, 50*this.state.focalY-this.state.wrapperHeight/2);

        this.setState({
            marginTop: -offsetY,
            marginLeft: -offsetX,
        }, ()=>{
            canvas.style.marginTop = -offsetY+"px";
            canvas.style.marginLeft = -offsetX+"px";
        });
    }

    fillCell(x, y){
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 51, 51);
    }


    setUpCanvas(){
        console.log(this.state);
        const ctx = this.refs.canvas.getContext('2d');
        let canvas = this.refs.canvas;
        this.refs.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.refs.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.addGridLines(ctx, 1);
        this.navigateToFocus();
    }
    
    render() {
        let height = this.state.canvasWidth;
        let width = this.state.canvasHeight;
        return (
        <div className="Canvas-wrapper" ref="canvasWrapper" style={{cursor: "move", background: "green", overflow: "hidden",  height: "75vh"}}>
                <canvas ref="canvas" width={width+"px"} height={height+"px"} style={{background: "red"}}></canvas>
        </div>
        );
    }
}
