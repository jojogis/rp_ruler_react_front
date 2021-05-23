import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Grid, Popover, withStyles} from "@material-ui/core";
import Utils from "./Utils";


class AbilitiesPopup extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state={
            abilities:[{id:1,color:"blue",name:"Ебнуть"},
                {id:2,color:"orange",name:"Сильно ебнуть"},
                {id:3,color:"lime",name:"Очень сильно ебнуть"},
                {id:4,color:"red",name:"Открыть портал на Спарту"},
                {id:5,color:"green",name:"Призыв сыча"}
                ]
        }
    }


    render() {
        const {classes} = this.props;

        return(<Popover
            open={this.props.open}
            anchorEl={this.props.anchorEl}
            onClose={this.props.onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}

            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}><div style={{padding:"10px"}}>
            <Grid container justify="center" alignItems="center" spacing={2} style={{minWidth:400,maxWidth:"50vw"}}>
                {this.state.abilities.map((ability)=>(
                    <Grid item><Button onClick={() => this.props.onAddAbility(ability)} className={classes[ability.color]} item variant="contained">{ability.name}</Button></Grid>
                ))}




            </Grid>

        </div>
        </Popover>)
    }

}
const styles = {
    ...Utils.colors
};

export default withStyles(styles)(AbilitiesPopup);