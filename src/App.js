import Cookies from 'universal-cookie';
import './App.css';
import * as React from "react";
import Auth from "./Auth";
import Reg from "./Reg";
import Chat from "./Chat";
import {createMuiTheme, Snackbar} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core";
import {Route, Switch, Redirect} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import TokenContext from "./AppContext";
import Restore from "./Restore";
import ParticlesBg from "particles-bg";
import {Alert} from "@material-ui/lab";
import Api from "./Api";



export class App extends React.Component{

    constructor(props) {
        super(props);
        let darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });
        let lightTheme = createMuiTheme({
            palette: {
                type: 'light',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });

        const token = localStorage.token;
        const user_id = localStorage.user_id;
        const user_type = localStorage.user_type;
        const isDarkTheme = localStorage.is_dark_theme == "1";
        const isAnimationEnable = localStorage.is_animation_enable !== "0";
        this.handleLogin = this.handleLogin.bind(this);
        this.toggleTheme = this.toggleTheme.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            token:token,
            user_id:user_id,
            user_type:user_type,
            isDarkTheme:isDarkTheme,
            toggleTheme:this.toggleTheme,
            logout:this.logout,
            snackBarOpen:false,
            alertMessage:"",
            alertStatus:"success",
            showMessage:(message,status) => {
                this.setState({alertMessage:message,snackBarOpen:true,alertStatus:status});
            },
            isAnimationEnable:isAnimationEnable,
            toggleAnimation: () => {
                localStorage.setItem("is_animation_enable",!this.state.isAnimationEnable ? "1" : "0");
                this.setState(
                (state)=>{return {isAnimationEnable:!state.isAnimationEnable}
                });
            },
            theme:isDarkTheme ? darkTheme : lightTheme
        };
        if(this.state.token != null){
            Api.checkToken(this.state.token).then((data)=>{
                if(data.correct == 0){
                    this.logout();
                }
            })
        }



    }

    logout(){
        localStorage.setItem("token",null);
        localStorage.setItem("user_id",null);
        localStorage.setItem("user_type",null);
        this.setState({token:null,user_id:null,user_type:null});
    }

    handleLogin(token,id,user_type){
        localStorage.setItem("token",token);
        localStorage.setItem("user_id",id);
        localStorage.setItem("user_type",user_type);
        this.setState({token:token,user_id:id,user_type:user_type});
    }



    toggleTheme () {
        let darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });
        let lightTheme = createMuiTheme({
            palette: {
                type: 'light',
                primary: {
                    main: "#ff5722",
                },
                secondary: {
                    main: "#ff5722",
                },
            },
        });
        this.setState(state => ({
            theme:state.isDarkTheme ? lightTheme : darkTheme,
            isDarkTheme: !state.isDarkTheme
            }),() => {
                this.forceUpdate();
                localStorage.setItem("is_dark_theme",this.state.isDarkTheme ? "1" : "0");
        }
        );

    }



    render() {
        /*
        let randIndex = Math.floor(Math.random()*4);
        let effect = null;
        switch(randIndex){
            case 0:
                effect = <ParticlesBg color="#ff5722" num={200} type="cobweb"  bg={true} />;
                break;
            case 1:
                effect = <ParticlesBg color="#303030" num={200} type="lines"  bg={true} />;
                break;
            case 2:
                effect = <ParticlesBg color="#ff5722" num={20} type="fountain"  bg={true} />;
                break;
            case 3:
                effect = <ParticlesBg color="#ff5722" num={20} type="polygon"  bg={true} />;
                break;
        }*/
        return(
            <TokenContext.Provider value={this.state}>
                <ThemeProvider theme={this.state.theme}>
            <Router>
                {this.state.isAnimationEnable ? <ParticlesBg color="#ff5722" num={200} type="cobweb"  bg={true} /> : ""}
                <Switch>
                    <Route path="/login">
                        <Auth onLogin={this.handleLogin}/>
                    </Route>
                    <Route path="/registration">
                        <Reg onReg={this.handleLogin}/>
                    </Route>
                    <Route path="/restore">
                        <Restore/>
                    </Route>
                    <PrivateRoute token={this.state.token} path="/">
                        <Chat isDarkTheme={this.state.isDarkTheme}/>
                        <Snackbar open={this.state.snackBarOpen} autoHideDuration={3000} onClose={()=>this.setState({snackBarOpen:false})}>
                            <Alert severity={this.state.alertStatus} variant="filled" elevation={6}>
                                {this.state.alertMessage}
                            </Alert>
                        </Snackbar>
                    </PrivateRoute>
                </Switch>
            </Router>
                </ThemeProvider>
            </TokenContext.Provider>
                );
    }
}
function PrivateRoute({ children, ...rest }) {
    let contextType = TokenContext;
    return (
        <Route
            {...rest}
            render={({ location }) =>
                rest.token != null ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}