import * as React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";

class RoomAppBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            open:false
        };
    }
    render(){
        const {classes} = this.props;
        if(this.props.description != null && this.props.description.length > 100){
            return(<AppBar color="default" position="absolute">
                <Toolbar>
                    <Accordion className={classes.accordion} expanded={this.state.open} onChange={() => this.setState((state) => {return {open:!state.open}} )}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            id="panel1bh-header"
                        >
                            <Typography className={classes.divider} variant="h6" noWrap>
                                {this.props.name}
                            </Typography>
                            {!this.state.open ? <Typography className={classes.description} variant="body2" noWrap>
                                {this.truncateString(this.props.description,100)}
                            </Typography> : ""}
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2">
                                {this.props.description}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>


                </Toolbar>
            </AppBar>);
        }else{
            return(<AppBar color="default" position="static">
                <Toolbar>
                    <Typography className={this.props.description != "" ? classes.divider : ""} variant="h6" noWrap>
                        {this.props.name}
                    </Typography>
                    <Typography className={classes.description} variant="body2" noWrap>
                        {this.truncateString(this.props.description,100)}
                    </Typography>

                </Toolbar>
            </AppBar>);
        }

    }
    truncateString(str, num) {
        if(str == null)return  null;
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }

}

const styles = {
    accordion:{
        background:"transparent",
        boxShadow:"none"
    },
    divider:{
        borderRight:"1px solid #888",
        paddingRight:"10px"
    },
    description:{
        marginTop:"5px",
        marginLeft:"10px"
    }

};
export default withStyles(styles)(RoomAppBar);