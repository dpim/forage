import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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

export class SubmissionForm extends Component {
	render() {
		return (
			<div>
				<h3>{this.props.title}</h3>
				<p>{this.props.description}</p>
				<img src="" />
			</div>
		);
	}
}

export class LoginContainer extends Component {
	render(){
		return (
			<div>
				<h2>Something special awaits</h2>
				<div>
				<Link className="Register-link" to={"/register"}><h3>Create account</h3></Link>          
				<Link className="Signin-link" to={"/existing"}>I already have an account</Link>
				</div>
			</div>
		);
	}
}

export class RegisterContainer extends Component {
	constructor(){
		super();
		this.submit.bind(this);
		this.handleChange.bind(this);
		this.state = {
			username: null,
			email: null,
			password: null,
			didAcceptTerms: false
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

	submit(){
		console.log("submitted")
		console.log(this.state);
	}
	
	render(){
		return (
			<div>
				<h2>Good to meet you</h2>
				<h3>Username</h3>
				<input type="text" name="username" placeholder="Choose a name" onChange={(event)=>this.handleChange(event)} />
				<h3>Email</h3>
				<input type="text" name="email" placeholder="Your email" onChange={(event)=>this.handleChange(event)} />
				<h3>Password</h3>
				<input type="text" name="password" placeholder="Choose a password" onChange={(event)=>this.handleChange(event)} />
				<div>
					<div className="Legal-section">
						I agree to the <Link className="Terms-link" to={"/terms"}> Terms of Service </Link>    
						<input name="didAcceptTerms" type="checkbox" onChange={(event)=>this.handleCheckBoxChange(event)}  />
					</div>
					<button onClick={()=>this.submit()}>Register</button>
				</div>
			</div>
		);
	}
}

export class ExistingContainer extends Component {
  constructor(){
		super();
		this.submit.bind(this);
		this.handleChange.bind(this);
		this.state = {
			username: null,
			password: null,
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
		console.log("submitted")
		console.log(this.state);
	}
	
	render(){
		return (
			<div>
				<h2>Welcome</h2>
				<h3>Username</h3>
				<input type="text" name="username" placeholder="Your username" onChange={(event)=>this.handleChange(event)} />
				<h3>Password</h3>
				<input type="text" name="password" placeholder="Your password" onChange={(event)=>this.handleChange(event)} />
				<div className='Submit-section'>
					<button onClick={()=>this.submit()}>Sign in</button>
				</div>
			</div>
		);
	}
}

export class ForageSearch extends Component {
	render(){
		return (
			<div>
				<input type="text" name="searchTerm" placeholder="Query" onChange={()=>console.log('typing...')} />
				<button onClick={()=>console.log('clicked')}>Search</button>
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
	height(){
		return 2020;
	}

	width(){
		return 2020;
	}

	addGridLines(context, zoom){
		let height = this.height();
		let width = this.width();
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

	componentDidMount(){
		this.setUpCanvas();
	}

	setUpCanvas(){
		const ctx = this.refs.canvas.getContext('2d');
		let canvas = this.refs.canvas;
		let dragging = false;
		let canvasWrapperHeight = this.refs.canvasWrapper.clientHeight;
		let canvasWrapperWidth = this.refs.canvasWrapper.clientWidth;
		let height = this.height();
		let width = this.width();
		let lastX;
		let lastY;
		let marginLeft = 0;
		let marginTop = 0;
		this.refs.canvas.addEventListener('mousedown', function(e) {
			var evt = e || event;
			dragging = true;
			lastX = evt.clientX;
			lastY = evt.clientY;
			e.preventDefault();
		}, false);

		canvas.addEventListener('mousedown', function(e) {
			var evt = e || event;
			dragging = true;
			lastX = evt.clientX;
			lastY = evt.clientY;
			e.preventDefault();
		}, false);

		window.addEventListener('mousemove', function(e) {
			var evt = e || event;
			if (dragging) {
				var deltaX = evt.clientX - lastX;
				var deltaY = evt.clientY - lastY;
				lastX = evt.clientX;
				lastY = evt.clientY
				marginLeft += deltaX;
				marginTop += deltaY;

				console.log("-->",width-canvasWrapperWidth);
				console.log("-->",height-canvasWrapperHeight);
				console.log(marginLeft);
				console.log(marginTop);
				if (marginLeft < 0){
					if (Math.abs(marginLeft) > width-canvasWrapperWidth){
						canvas.style.marginLeft = -(width-canvasWrapperWidth)+"px";
					} else {
						canvas.style.marginLeft = marginLeft+"px";
					}
				} else {
					canvas.style.marginLeft =  "0px";
				}            
				if (marginTop < 0){
					if (Math.abs(marginTop) > height-canvasWrapperHeight){
						canvas.style.marginTop = -(height-canvasWrapperHeight)+"px";
					} else {
						canvas.style.marginTop = marginTop+"px";
					}
				} else {
					canvas.style.marginTop =  "0px";
				}     
			}
			e.preventDefault();
		}, false);

		window.addEventListener('mouseup', function() {
			dragging = false;
		}, false);

		this.addGridLines(ctx, 1);
	}
	
	render() {
		let height = this.height();
		let width = this.width();
		return (
		<div ref="canvasWrapper" id="canvasdiv" style={{cursor: "move", background: "green", overflow: "hidden",  height: "75vh"}}>
				<canvas ref="canvas" width={width+"px"} height={height+"px"} style={{background: "red"}}></canvas>
		</div>
		);
	}
}
