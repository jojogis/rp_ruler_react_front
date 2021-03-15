import Cookies from 'universal-cookie';
import './App.css';
import * as React from "react";
import Auth from "./Auth";
import Reg from "./Reg";
import Chat from "./Chat";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core";
import {Route, Switch, Redirect, useHistory, useLocation} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import TokenContext from "./AppContext";
import Restore from "./Restore";
import ParticlesBg from "particles-bg";
import {useEffect} from "react";


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





        const cookies = new Cookies();
        const token = cookies.get("token");
        const user_id = cookies.get("user_id");
        const user_type = cookies.get("user_type");
        const isDarkTheme = cookies.get("is_dark_theme") == "1";
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
            isAnimationEnable:true,
            toggleAnimation: () => {this.setState(
                (state)=>{return {isAnimationEnable:!state.isAnimationEnable}
                })},
            theme:isDarkTheme ? darkTheme : lightTheme
        };
        if(this.state.token != null){
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "token="+this.state.token
            };
            fetch("https://rp-ruler.ru/api/check_token.php",requestOptions)
                .then(response => response.json())
                .then((data)=>{
                    if(data["correct"] == 0){
                        this.logout();
                    }
                })
        }



    }

    logout(){
        const cookies = new Cookies();
        cookies.set("token",null);
        cookies.set("user_id",null);
        cookies.set("user_type",null);
        this.setState({token:null,user_id:null,user_type:null});
    }

    handleLogin(token,id,user_type){
        const cookies = new Cookies();
        cookies.set("token",token);
        cookies.set("user_id",id);
        cookies.set("user_type",user_type);
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
                const cookies = new Cookies();
                cookies.set("is_dark_theme",this.state.isDarkTheme ? "1" : "0");
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