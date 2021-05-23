import * as React from "react";

const AppContext = React.createContext({
    token:null,
    user_id:null,
    isDarkTheme:null,
    toggleTheme: () => {},
    logout:() => {},
    isAnimationEnabled:true,
    toggleAnimation:()=>{},
    showMessage:(message,status)=>{}
});
export default AppContext;