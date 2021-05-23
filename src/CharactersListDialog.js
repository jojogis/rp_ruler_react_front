import * as React from "react";
import TokenContext from "./AppContext";
import {Button, Dialog, DialogContent, Menu, MenuItem, withStyles} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import Api from "./Api";
import { DataGrid } from '@material-ui/data-grid';
import {Check, Delete, ExitToApp} from "@material-ui/icons";
import Utils from "./Utils";

class CharactersListDialog extends React.Component {
    static contextType = TokenContext;

    constructor(props) {
        super(props);
        this.state = {
            characters:[],
        };
        this.columns = [
            { field: 'id', headerName: 'ID', width: 70,sortable: false, },
            { field: 'name', headerName: 'Имя', width: 130,sortable: false, },
            { field: 'age', headerName: 'Возраст', width: 140,sortable: false, },
            { field: 'biography', headerName: 'Биография', width: 300,sortable: false, },
            { field: 'temper', headerName: 'Характер', width: 200,sortable: false },
            { field: 'extra', headerName: 'Дополнительно', width: 200,sortable: false, },
            { field: 'exp', headerName: 'Опыт', width: 130,sortable: false,editable: true },
            { field: 'comment', headerName: 'Комментарий', width: 200,sortable: false,editable: true  },
            { field: 'state1', headerName: 'Состояние', width: 130,
                valueGetter: (params) =>
                    `${params.getValue('state') == "1" ? 'На проверке' : "Активен"}`
            },
            {field:'actions',headerName: " ",width:170,sortable: false,renderCell: (params) => (<div>
                    {params.getValue("state") == "1" ? <Button style={{marginRight:"10px"}} onClick={() => this.handleConfirmCharacter(params.getValue("id"))}
                                                               variant="contained" color="secondary"><Check/></Button> : ""}
                    <Button variant="contained" color="secondary" onClick={() => this.handleDeleteCharacter(params.getValue("id"))}><Delete/></Button></div>)}
        ];
        this.handleDeleteCharacter = this.handleDeleteCharacter.bind(this);
        this.loadCharacters = this.loadCharacters.bind(this);
        this.handleCharacterChange = this.handleCharacterChange.bind(this);
    }

    componentDidMount() {
        this.loadCharacters();
    }


    handleDeleteCharacter(id){
        Api.deleteCharacter(this.context.token,id).then((data)=>{
            this.loadCharacters();
        })
    }

    handleConfirmCharacter(id){
        Api.confirmCharacter(this.context.token,id).then((data)=>{
            this.loadCharacters();
        })
    }

    loadCharacters(){
        Api.getCharacters(this.context.token,this.props.serverId).then((data)=>{
            this.setState({characters:data.characters});
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.serverId !== this.props.serverId) {
            this.loadCharacters();
        }
    }

    handleCharacterChange(param){
        if(param.field === "comment") {
            Api.addCommentToCharacter(this.context.token, param.id, param.props.value).then((data) => {
                this.loadCharacters();
            })
        }else if(param.field === "exp"){
            Api.changeCharactersExp(this.context.token, param.id, param.props.value).then((data) => {
                this.loadCharacters();
            })
        }}


    render() {
        const {classes} = this.props;
        return(<Dialog maxWidth="xl" fullWidth open={this.props.open} onClose={this.props.onClose}
                       aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" onClose={this.props.onClose}>
                Персонажи
            </DialogTitleWithClose>
            <DialogContent dividers>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={this.state.characters}
                        columns={this.columns}
                        pageSize={8}
                        onEditCellChangeCommitted={this.handleCharacterChange}
                        disableSelectionOnClick={true}
                        disableColumnSelector={true}
                        disableColumnFilter={true}
                        localeText={Utils.dataGridLocale}
                    />
                </div>
            </DialogContent>
        </Dialog>);
    }
}

const styles = {
    add:{
        color:"#00e676"
    },
    paperWrap:{
        width:"100%",

    },
    delete:{
        color:"#f50057",
        "padding-right":"70px"
    },
    edit:{
        color:"#ffc107"
    },
    icon:{
        position:"absolute",
        right:"10px"
    }


};

export default withStyles(styles)(CharactersListDialog);