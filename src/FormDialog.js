import * as React from "react";
import TokenContext from "./AppContext";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    TextField,
    withStyles
} from "@material-ui/core";

class FormDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event,key){
        this.setState({[key]:event.target.value});
    }
    render() {

        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.props.text}</DialogTitle>

            <DialogContent>
                {this.props.names.map((item,i)=>(
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(event) => this.handleChange(event,item)}
                        label={this.props.labels[i]}
                        type={this.props.types[i]}
                        fullWidth
                    />
                ))}

            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.props.onSave(this.state)} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>);
    }

}
const styles = {

};
export default withStyles(styles)(FormDialog);