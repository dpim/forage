import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { SubmissionContainer } from './submissionComponents'
import { AccountContainer, LoginContainer, RegisterContainer, ExistingContainer } from './loginComponents'
import { Menu, Description, ForageCanvas, ForageContainer, ContactContainer } from './mainComponents';
import { Descriptions } from './descriptions'
import './App.css';

import { BrowserRouter as Router, Link, Route, Redirect, Switch } from 'react-router-dom'
const pages = ["home", "new"];

class App extends Component {
  constructor(){
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      token: '<token>',
      signedIn: true,
      collapsed: false
    };
  }

  signIn(token){
    this.setState({token: token});
  }

  signOut(){
    this.setState({token: null});
  }

  toggle() {
    this.setState({
      collapsed: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="App">
       <Router>
         <div>
           <div className="Header">
          	<Navbar color="clear" light>
            <NavbarBrand href="/"><span className="Header">4EJ</span></NavbarBrand>
              <Nav className="ml-auto">
                <NavItem>
                  <NavLink href="/board/">Board</NavLink>
                </NavItem>
                <NavItem>
                {
                  (this.state.signedIn) ?
                  <NavLink href="/new/">New</NavLink> :
                  <NavLink href="/join/">New</NavLink>
                }
                </NavItem>
                <NavItem className="Fake-nav">
                </NavItem>
                <NavItem>
                {
                  (this.state.signedIn) ?
                  <NavLink className="Secondary-nav-link" href="/signout">Sign out</NavLink> :
                  <NavLink className="Secondary-nav-link" href="/join/">Join</NavLink>
                }                
                </NavItem> 
                <NavItem>
                  <NavLink className="Secondary-nav-link" href="/contact/">Contact</NavLink>
                </NavItem>
              </Nav>
          </Navbar>
            </div>
            <div className="Main">
              <Switch>
                <Route exact path="/" render={() => (
                    <Redirect to="/board"/>
                )}/>
                  <Route exact path="/signout/" render={() => (
                    //make request
                    <Redirect to="/join"/>
                )}/>
                
                <Route exact path={"/account"} render={()=><AccountContainer />}/>
                <Route exact path={"/join"} render={()=><LoginContainer />}/>
                <Route exact path={"/register"} render={()=><RegisterContainer />}/>
                <Route exact path={"/existing"} render={()=><ExistingContainer />}/>
                <Route exact path={"/404"} render={()=><Description text={Descriptions["404"]}/>}/>
                <Route exact path={"/terms"} render={()=><Description text={Descriptions["terms"]}/>}/>
                <Route exact path={"/board"} render={()=><ForageContainer />}/>
                <Route exact path={"/new"} render={()=><SubmissionContainer />}/>
                <Route exact path={"/contact"} render={()=><ContactContainer />}/>
                <Redirect to="/404"/>
              </Switch>
            </div>
            </div>
        </Router>
      </div>
    );
  }
}

export default App;
