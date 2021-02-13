import * as React from "react";
import {Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";




class AddServerDialog extends React.Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
    }

    render() {

        return (<Dialog maxWidth="sm" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                Добавление сервера
            </DialogTitleWithClose>
            <DialogContent dividers>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Название сервера"
                    name="name"
                    autoFocus
                    inputRef={this.name}
                />
            </DialogContent>
        </Dialog>);
    }
}
const styles1 = {

};
export default withStyles(styles1)(AddServerDialog);