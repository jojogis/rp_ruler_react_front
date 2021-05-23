import * as React from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent, Divider,
    Fab,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction, ListItemText, MenuItem,
    Paper,
    Radio,
    RadioGroup, Select,
    Switch,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import DialogTitleWithClose from "./DialogTitleWithClose";
import {Autocomplete} from "@material-ui/lab";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TokenContext from "./AppContext";

import * as PropTypes from "prop-types";
import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable

} from 'react-reorder';
import {Add, Check, Delete, DeleteOutline, Edit} from "@material-ui/icons";
import {blue, cyan, deepPurple, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";
import Api from "./Api";
import Utils from "./Utils";
import {DataGrid, isNumber} from "@material-ui/data-grid";
import {number} from "prop-types";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


class AddServerDialog extends React.Component {
    static contextType = TokenContext;
    constructor(props) {
        super(props);
        this.tags = ["Аниме","Хентай","Фури","Ужасы","Детектив","Приключения","Эротика","Криминал","Мистика","Комедия","Фантастика"];
        let tagsArr = [];
        if(this.props.tags != null){
            tagsArr = this.props.tags.split(",");
            if(tagsArr == null || tagsArr[0] == "")tagsArr = [];
            if(!(tagsArr instanceof Array))tagsArr = [tagsArr];
        }


        this.state = {
            tags:tagsArr,
            roles:this.props.roles ?? [],
            name:this.props.name ?? "",
            avatar:this.props.avatar,
            description:this.props.description,
            isPrivate:this.props.isPrivate,
            age:this.props.age ?? "0",
            bg:this.props.bg == null || this.props.bg === "null" ? null : this.props.bg,
            isNameError:"",
            tab:0,
            currentRole:0,
            levels:this.props.levels ?? [],
            characterClasses:this.props.characterClasses ?? [],
            abilities:this.props.abilities ?? [],
            effects:this.props.effects ?? [],
        };

        this.levelsColumns = [
            { field: 'number', headerName: 'Номер', width: 130,sortable: true,editable:false },
            { field: 'hp', headerName: 'HP', width: 130,sortable: false,editable:true },
            { field: 'mp', headerName: 'MP', width: 130,sortable: false,editable:true },
            { field: 'exp', headerName: 'EXP', width: 130,sortable: false,editable:true },
            { field: 'actions',headerName: " ",width:170,sortable: false,renderCell: (params) =>
                    (<Button onClick={() => this.handleDeleteLevel(params.getValue("id"))} variant="contained" color="secondary"><Delete/></Button>)}
        ];

        this.effectsColumns = [
            { field: 'name', headerName: 'Название', width: 170,sortable: true,editable:true },
            { field: 'description', headerName: 'Описание', width: 200,sortable: true,editable:true },
            { field: 'time', headerName: 'Длительность', width: 200,sortable: true,editable:true },
            { field:"dhp",headerName: "ΔHP",description: "Изменение HP (отрицательное или положительное число)",sortable: true,editable:true},
            { field:"dmp",headerName: "ΔMP",description: "Изменение MP (отрицательное или положительное число)",sortable: true,editable:true},
        ];



        this.abilityColumns = [
            { field: 'name', headerName: 'Название', width: 170,sortable: true,editable:true },
            { field: 'description', headerName: 'Описание', width: 200,sortable: true,editable:true },
            { field: 'level', headerName: 'Доступно с уровня', width: 180,sortable: true,editable:true },
            { field: 'color', headerName: 'Цвет', width: 180,sortable: true,editable:false,renderCell:(params => (
                    <Select value={params.getValue("color")} onChange={(event)=>this.handleChangeAbilityColor(event,params.getValue("id"))}>
                        <MenuItem value={"default"}>Белый</MenuItem>
                        <MenuItem value={"red"}>Красный</MenuItem>
                        <MenuItem value={"blue"}>Синий</MenuItem>
                        <MenuItem value={"green"}>Зеленый</MenuItem>
                        <MenuItem value={"lime"}>Лайм</MenuItem>
                        <MenuItem value={"orange"}>Оранжевый</MenuItem>
                        <MenuItem value={"pink"}>Розовый</MenuItem>
                        <MenuItem value={"purple"}>Фиолетовый</MenuItem>
                        <MenuItem value={"cyan"}>Сине-зеленый</MenuItem>
                        <MenuItem value={"yellow"}>Желтый</MenuItem>
                    </Select>
                )) },
            { field: 'classesNeeded', headerName: 'Доступно для классов',description:"Способность будет доступна для игрока, если у него есть один из выбранных классов, начиная с выбранного уровня",
                width: 350,sortable: true,editable:false,renderCell:(params)=>(
                    <Autocomplete
                        multiple
                        options={this.state.characterClasses}
                        getOptionLabel={(o)=>o.name}
                        value={params.getValue("classesNeeded")}
                        name="tags"
                        clearText="Очистить"
                        fullWidth
                        noOptionsText="Нет классов"
                        filterSelectedOptions={true}
                        getOptionSelected={(o,v)=>o.id===v.id}
                        onChange={(e,value)=>this.handleNeededClassesChange(e,value,params.getValue("id"))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className={"characterClassInput"}
                            />
                        )}
                    />
                ) },
            {field:"dhp",headerName: "ΔHP",description: "Изменение HP (отрицательное или положительное число)",sortable: true,editable:true},
            {field:"dmp",headerName: "ΔMP",description: "Изменение MP (отрицательное или положительное число)",sortable: true,editable:true},
            {field:"effects",headerName: "Эффекты",sortable: true,editable:false,width:300,renderCell:(params)=>(
                    <Autocomplete
                        multiple
                        options={this.state.effects}
                        getOptionLabel={(o)=>o.name}
                        value={params.getValue("effects")}
                        name="tags"
                        clearText="Очистить"
                        fullWidth
                        noOptionsText="Нет эффектов"
                        filterSelectedOptions={true}
                        getOptionSelected={(o,v)=>o.id===v.id}
                        onChange={(e,value)=>this.handleEffectsOfAbilityChange(e,value,params.getValue("id"))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className={"characterClassInput"}
                            />
                        )}
                    />
                )},
            {field: 'actions',headerName: " ",width:80,sortable: false,renderCell: (params) =>
                    (<Button onClick={() => this.handleDeleteLevel(params.getValue("id"))} variant="contained" color="secondary"><Delete/></Button>)}
        ];

        this.classesColumns = [
            { field: 'name', headerName: 'Название', width: 170,sortable: true,editable:true },
            { field: 'description', headerName: 'Описание', width: 300,sortable: true,editable:true },
            { field: 'actions',headerName: " ",width:80,sortable: false,renderCell: (params) =>
                    (<Button onClick={() => this.handleDeleteClass(params.getValue("id"))} variant="contained" color="secondary"><Delete/></Button>)}
        ];

        this.handleDeleteRole = this.handleDeleteRole.bind(this);
        this.handleReorder = this.handleReorder.bind(this);
        this.handleRoleSwitchChange = this.handleRoleSwitchChange.bind(this);
        this.handleAddRole = this.handleAddRole.bind(this);
        this.handleFileUploaded = this.handleFileUploaded.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleRoleNameChange = this.handleRoleNameChange.bind(this);
        this.handleAddLevel = this.handleAddLevel.bind(this);
        this.handleLevelEdit = this.handleLevelEdit.bind(this);
        this.handleDeleteLevel = this.handleDeleteLevel.bind(this);
        this.handleAddClass = this.handleAddClass.bind(this);
        this.handleClassEdit = this.handleClassEdit.bind(this);
        this.handleNeededClassesChange = this.handleNeededClassesChange.bind(this);
        this.handleAddAbility = this.handleAddAbility.bind(this);
        this.handleAbilityEdit = this.handleAbilityEdit.bind(this);
        this.handleChangeAbilityColor = this.handleChangeAbilityColor.bind(this);
        this.handleAddEffect = this.handleAddEffect.bind(this);
        this.handleEditEffect = this.handleEditEffect.bind(this);
        this.handleEffectsOfAbilityChange = this.handleEffectsOfAbilityChange.bind(this);
    }

    componentDidMount() {
        Api.getLevels(this.context.token,this.props.serverId).then((data)=>{
            this.setState({levels:data.levels});
        })
        Api.getClasses(this.context.token,this.props.serverId).then((data)=>{
            this.setState({characterClasses:data.classes});
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.setState({name:this.props.name});
        }
        if (prevProps.description !== this.props.description) {
            this.setState({description:this.props.description});
        }
        if (prevProps.tags !== this.props.tags) {
            let tagsArr = this.props.tags.split(",");
            if(tagsArr == null || tagsArr[0] == "")tagsArr = [];
            if(!(tagsArr instanceof Array))tagsArr = [tagsArr];
            this.setState({tags:tagsArr});
        }
        if (prevProps.isPrivate !== this.props.isPrivate) {
            this.setState({isPrivate:this.props.isPrivate});
        }
        if (prevProps.age !== this.props.age) {
            this.setState({age:this.props.age});
        }
        if (prevProps.avatar !== this.props.avatar) {
            this.setState({avatar:this.props.avatar});
        }
        if (prevProps.bg !== this.props.bg) {
            this.setState({bg:this.props.bg == null || this.props.bg === "null" ? null : this.props.bg});
        }
        if (prevProps.roles !== this.props.roles) {
            this.setState({roles:this.props.roles ?? []});
        }
        if(prevProps.serverId != this.props.serverId && this.props.serverId != null){
            Api.getLevels(this.context.token,this.props.serverId).then((data)=>{
                this.setState({levels:data.levels});
            })
            Api.getClasses(this.context.token,this.props.serverId).then((data)=>{
                this.setState({characterClasses:data.classes});
            })
        }

    }

    handleNeededClassesChange(e,value,id){
        let newAbilities = [...this.state.abilities];
        let ability = Utils.getElById(newAbilities,id);
        ability.classesNeeded = [];
        value.forEach((v)=>{
            ability.classesNeeded.push({id:v.id,name:v.name});
        })
        this.setState({abilities:newAbilities});

    }

    handleEffectsOfAbilityChange(e,value,id){
        let newAbilities = [...this.state.abilities];
        let ability = Utils.getElById(newAbilities,id);
        ability.effects = [];
        value.forEach((v)=>{
            ability.effects.push({id:v.id,name:v.name});
        })
        this.setState({abilities:newAbilities});
    }

    handleAddAbility(){
        let maxId = 0;
        this.state.abilities.forEach((ability)=>{
            let prevId = (ability.id+"").replace("new","")*1;
            if(prevId > maxId)maxId = prevId;
        })
        let newAbilities = [...this.state.abilities];
        newAbilities.push({id:"new"+(maxId+1),name:"Новая способность",level:0,description:"",color:"default",classesNeeded:[],effects:[]});
        this.setState({abilities:newAbilities});
    }

    handleChangeAbilityColor(event,id){
        let newAbilities = [...this.state.abilities];
        let ability = Utils.getElById(newAbilities,id);
        ability.color = event.target.value;
        this.setState({abilities:newAbilities});
    }

    handleAbilityEdit(params){

        let newAbilities = [...this.state.abilities];
        if(params.field === "level" && !Number.isInteger(params.props.value*1)){
            this.setState({abilities:newAbilities});
            return;
        }
        let ability = Utils.getElById(newAbilities,params.id);
        ability[params.field] = params.props.value;
        this.setState({abilities:newAbilities});
        console.log(newAbilities);
    }

    handleAddClass(){
        let maxId = 0;
        this.state.characterClasses.forEach((characterClass)=>{
            let prevId = (characterClass.id+"").replace("new","")*1;
            if(prevId > maxId)maxId = prevId;
        })
        let newClasses = [...this.state.characterClasses];
        newClasses.push({id:"new"+(maxId+1),name:"Новый класс",description:""});
        this.setState({characterClasses:newClasses});
    }

    handleDeleteClass(id){
        let newClasses = [...this.state.characterClasses];
        Utils.removeElById(newClasses,id);
        this.setState({characterClasses:newClasses});
    }

    handleClassEdit(params){

        let newClasses = [...this.state.characterClasses];
        let oldClass = Utils.getElById(newClasses,params.id);

        oldClass[params.field] = params.props.value;
        this.setState({characterClasses:newClasses});
        console.log(newClasses);
    }


    handleAddLevel(){
        let maxNumber = 0;
        this.state.levels.forEach((level)=>{
            if(level.number > maxNumber)maxNumber = level.number;
        })
        let newLevels = [...this.state.levels];
        let prevExp = newLevels.find((level) => level.number === maxNumber)?.exp ?? 0;
        newLevels.push({id:"new"+(maxNumber+1),number:maxNumber+1,hp:1,mp:1,exp:prevExp + 1,serverId:this.props.serverId});
        this.setState({levels:newLevels});

    }

    handleAddEffect(){
        let maxId = 0;
        this.state.effects.forEach((effect)=>{
            let prevId = (effect.id+"").replace("new","")*1;
            if(prevId > maxId)maxId = prevId;
        })
        let newEffects = [...this.state.effects];
        newEffects.push({id:"new"+(maxId+1),name:"Новый эффект",description:"",time:0,dhp:0,dmp:0});
        this.setState({effects:newEffects});
    }

    handleEditEffect(params){
        let newEffects = [...this.state.effects];
        let effect = Utils.getElById(newEffects,params.id);

        effect[params.field] = params.props.value;
        this.setState({effects:newEffects});
        console.log(newEffects);
    }

    handleDeleteLevel(id){
        let newLevels = [...this.state.levels];
        let deletedNumber = Utils.getElById(newLevels,id).number;

        Utils.removeElById(newLevels,id);
        newLevels.forEach((level)=>{
            if(level.number > deletedNumber){
                level.number--;
                if(level.id.indexOf("new") != -1)level.id = "new" + level.number;
            }
        })
        this.setState({levels:newLevels});
    }

    handleLevelEdit(params){
        let newLevels = [...this.state.levels];
        let newValue = params.props.value;
        let level = Utils.getElById(newLevels,params.id);
        if(params.field === "exp" ){
            let prevLevel = newLevels.find((l) => l.number === level.number - 1);
            let nextLevel = newLevels.find((l) => l.number === level.number + 1);
            if(prevLevel != null && prevLevel.exp >= newValue){
                this.context.showMessage("Опыт для последующего уровня, должен быть больше, чем опыт для предыдущего.","error");
                this.setState({levels:newLevels});
                return;
            }
            if(nextLevel != null && nextLevel.exp <= newValue){
                this.context.showMessage("Опыт для последующего уровня, должен быть больше, чем опыт для предыдущего.","error");
                this.setState({levels:newLevels});
                return;
            }
        }
        level[params.field] = parseInt(newValue);
        this.setState({levels:newLevels});
    }

    handleFileUploaded(event){
        if(event.target.files != null && event.target.files.length != 0){
            let file = event.target.files[0];
            Api.uploadFile(this.context.token,file).then((data)=>{
                if(event.target.name=="bg"){
                    this.setState({bg:data.filename});
                }else{
                    this.setState({avatar:data.filename});
                }
            })
        }

    }

    handleReorder (event, previousIndex, nextIndex, fromId, toId) {
        this.setState({
            roles: reorder(this.state.roles, previousIndex, nextIndex),
            //currentRole:nextIndex
        },() => this.setState({currentRole:nextIndex}));
    }

    handleSubmit(){

        if(this.state.name.length == 0){
            this.setState({isNameError:"Введите название"});
            return;
        }
        if(this.state.name.length > 20){
            this.setState({isNameError:"Максимальная длина - 20 символов"});
            return;
        }
        if(this.props.serverId == null){
            Api.addServer(this.context.token,this.state.age,this.state.name,this.state.description,this.state.avatar,
                this.state.isPrivate,this.state.bg,this.state.tags,this.state.roles).then((data)=>{
                    if(this.props.onCreate != null)this.props.onCreate(this.props.serverId ?? data.id);
                    this.props.onClose();
            })
        }else {
            Api.editServer(this.context.token,this.props.serverId,this.state.age,this.state.name,this.state.description,this.state.avatar,
                this.state.isPrivate,this.state.bg,this.state.tags,this.state.roles,this.state.levels,this.state.characterClasses).then((data)=>{
                if(this.props.onCreate != null)this.props.onCreate(this.props.serverId ?? data.id);
                this.props.onClose();
            })
        }

    }

    handleRoleSwitchChange(name,value){
        let newRoles = [...this.state.roles];
        newRoles[this.state.currentRole][name] = value*1;
        this.setState({roles:newRoles});
    }

    handleAddRole(){
        let newRoles = [...this.state.roles];
        newRoles.push({id: 0,
            msg_delete: 0,
            msg_send: 0,
            name: "Новая роль",
            role_edit: 0,
            server_edit: 0,
            room_edit:0,
            playing:0,
            control_playing:0,
            color:"default",
            immutable:0,
            server_id:this.props.serverId });
        this.setState({roles:newRoles});
    }

    handleDeleteRole(index){
        let newRoles = [...this.state.roles];
        newRoles.splice(index, 1);
        let newCurrentRole = this.state.currentRole;
        if(newCurrentRole === newRoles.length)newCurrentRole--;

        this.setState({roles:newRoles},() => this.setState({currentRole:newCurrentRole}));
    }

    handleColorChange(color){
        let newRoles = [...this.state.roles];
        newRoles[this.state.currentRole].color = color;
        this.setState({roles:newRoles});
    }

    handleRoleNameChange(e){
        let newRoles = [...this.state.roles];
        newRoles[this.state.currentRole].name = e.target.value;
        this.setState({roles:newRoles});
    }

    render() {
        const {classes} = this.props;
        if(this.state.roles[this.state.currentRole] == null)this.state.currentRole = 0;
        let cantEditServer = this.props.role != null && !this.props.role.server_edit;
        let cantEditRoles = (this.props.role != null && !this.props.role.role_edit);
        let canControlPlaying = (this.props.role != null && this.props.role.control_playing);
        let immutableRole = (this.state.roles[this.state.currentRole] != null && this.state.roles[this.state.currentRole].immutable == 1);
        let roleColor = this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].color : "default";
        let btnText = this.props.serverId == null ? "Создать сервер" :  "Сохранить";
        return (<Dialog maxWidth="xl" fullWidth open={this.props.open} onClose={this.props.onClose}
                        aria-labelledby="form-dialog-title">
            <DialogTitleWithClose id="customized-dialog-title" noPadding={true} onClose={this.props.onClose}>
                <Paper square>
                <Tabs value={this.state.tab} indicatorColor="primary"
                      textColor="primary" onChange={(e,value) => this.setState({tab:value})}>
                    <Tab value={0} label="Основные" className={classes.tabs} />
                    {this.props.serverId != null ? <Tab label="Роли" value={1}  className={classes.tabs}/>: ""}
                    {this.props.serverId != null && canControlPlaying ? <Tab label="Уровни персонажей" value={2}  className={classes.tabs}/>: ""}
                    {this.props.serverId != null && canControlPlaying ? <Tab label="Классы персонажей" value={3}  className={classes.tabs}/>: ""}
                    {this.props.serverId != null && canControlPlaying ? <Tab label="Способности" value={4}  className={classes.tabs}/>: ""}
                    {this.props.serverId != null && canControlPlaying ? <Tab label="Эффекты" value={5}  className={classes.tabs}/>: ""}
                </Tabs>
                </Paper>
            </DialogTitleWithClose>
            <DialogContent>
                <TabPanel value={this.state.tab} index={0}>
                <Grid container justify="center">

                    <Avatar item src={Utils.uploadDir+this.state.avatar} className={classes.avatar}>
                        <Fab>{this.state.name.substr(0,2)}</Fab>
                    </Avatar>
                    <input onChange={this.handleFileUploaded} disabled={cantEditServer} name="avatar" accept="image/*" className={classes.inputFile} id="button-file" type="file"/>
                    <label htmlFor="button-file">
                        <Button disabled={cantEditServer} variant="contained" color="primary" component="span">
                            Загрузить аватар.
                        </Button>
                    </label>
                </Grid><br/>
                <Grid container alignItems="center" direction="column">
                    {this.state.bg != null ? <img className={classes.bg} src={Utils.uploadDir+this.state.bg}/> : ""}
                    <br/>
                    <input onChange={this.handleFileUploaded} name="bg" accept="image/*" className={classes.inputFile} id="bg-file" type="file"/>
                    <label htmlFor="bg-file">
                        {this.state.bg === null ? <Button disabled={cantEditServer} variant="contained" color="primary" component="span">
                            Загрузить фон карточки.
                        </Button> : ""}
                    </label>
                </Grid>
                {this.state.bg != null ? <Grid container alignItems="center" direction="column">
                    <Button disabled={cantEditServer} onClick={() => this.setState({bg:null})} variant="contained" color="primary" component="span">
                        Удалить фон карточки.
                    </Button>
                </Grid> : ""}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled={cantEditServer}
                    helperText={this.state.isNameError}
                    onChange={(e)=>this.setState({name:e.target.value})}
                    label="Название сервера"
                    autoFocus
                    value={this.state.name}
                    error={this.state.isNameError.length != 0}

                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    disabled={cantEditServer}
                    id="description"
                    label="Описание"
                    name="description"
                    multiline
                    rowsMax={5}
                    onChange={(e)=>this.setState({description:e.target.value})}
                    value={this.state.description}
                />
                <br/><br/>
                <Autocomplete
                    multiple
                    options={this.tags}
                    id="tags"
                    disabled={cantEditServer}
                    value={this.state.tags}
                    name="tags"
                    clearText="Очистить"
                    onChange = {(e,value) => {this.setState({tags:value}) }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Тэги"

                        />
                    )}
                />
                <br/>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.isPrivate}
                            onChange={(e)=>this.setState({isPrivate:e.target.checked})}
                            name="checkedB"
                            disabled={cantEditServer}
                            color="primary"
                        />
                    }
                    label="Приватный"
                />
                <br/><br/>
                <FormLabel component="legend">Возрастное ограничение</FormLabel><br/>
                <RadioGroup row name="age" value={this.state.age} onChange={(e)=>this.setState({age:e.target.value})} defaultValue="top">
                    <FormControlLabel
                        value="0"
                        control={<Radio color="primary" />}
                        label="+0"
                        disabled={cantEditServer}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="6"
                        control={<Radio color="primary" />}
                        label="+6"
                        disabled={cantEditServer}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="12"
                        control={<Radio color="primary" />}
                        label="+12"
                        disabled={cantEditServer}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="16"
                        control={<Radio color="primary" />}
                        label="+16"
                        disabled={cantEditServer}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="18"
                        control={<Radio color="primary" />}
                        label="+18"
                        disabled={cantEditServer}
                        labelPlacement="end"
                    />
                </RadioGroup><br/>
                </TabPanel>

                <TabPanel value={this.state.tab} index={1}>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            {this.props.roles != null ?
                                <List >
                                    {this.state.roles.filter((role) => role.immutable == 1).map((item,i)=>(
                                        <ListItem key={i} selected={i===this.state.currentRole} onClick={() => this.setState({currentRole:i})} button className={classes.listItem+" "+classes[item.color+"Text"]}>
                                            {item.name}
                                            <IconButton disabled={cantEditRoles || item.immutable == 1} onClick={() => this.handleDeleteRole(i)} className={classes.listIcon}  edge="end" aria-label="comments">
                                                <DeleteOutline />
                                            </IconButton>

                                        </ListItem>
                                    ))}
                        <Reorder
                            reorderId="my-list" // Unique ID that is used internally to track this list (required)                            placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
                            draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
                            lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                            holdTime={100} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                            touchHoldTime={400} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
                            mouseHoldTime={100} // Hold time before dragging begins with mouse (optional), defaults to holdTime
                            autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                            disabled={cantEditRoles} // Disable reordering (optional), defaults to false
                            disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
                            onReorder={this.handleReorder}
                            placeholder={
                                <ListItem button className={classes.listItem+" "+classes.dragPlaceholder}/>
                            }
                        >
                            {this.state.roles.filter((role) => role.immutable == 0).map((item,i)=>(
                                <ListItem key={i+1} selected={i+1===this.state.currentRole} onClick={() => this.setState({currentRole:i+1})} button className={classes.listItem+" "+classes[item.color+"Text"]}>
                                    {item.name}

                                    <IconButton disabled={cantEditRoles || item.immutable == 1} onClick={() => this.handleDeleteRole(i+1)} className={classes.listIcon}  edge="end" aria-label="comments">
                                        <DeleteOutline />
                                    </IconButton>

                                </ListItem>
                            ))}


                        </Reorder>

                    </List>:""}<br/>
                            <Button variant="contained" disabled={cantEditRoles} fullWidth color="primary" onClick={this.handleAddRole} component="span">
                                Добавить роль
                            </Button>
                        </Grid>
                        <Grid className={classes.rightsList} item xs={8}>
                            <List>
                                <ListItem>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        onChange={this.handleRoleNameChange}
                                        label="Имя роли"
                                        autoFocus
                                        value={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].name : ""}
                                        disabled={cantEditRoles || immutableRole}
                                    />
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Цвет роли"
                                        secondary={<div><br/><br/><br/></div>}/>
                                    <ListItemSecondaryAction>
                                        <br/>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("default")} className={classes.colorBtn} color="default">{"default" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("red")} className={classes.colorBtn+" "+classes.red} color="primary">{"red" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("pink")} className={classes.colorBtn+" "+classes.pink} color="primary">{"pink" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("purple")} className={classes.colorBtn+" "+classes.purple} color="primary">{"purple" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("lime")} className={classes.colorBtn+" "+classes.lime} color="primary">{"lime" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("blue")} className={classes.colorBtn+" "+classes.blue} color="primary">{"blue" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("cyan")} className={classes.colorBtn+" "+classes.cyan} color="primary">{"cyan" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("green")} className={classes.colorBtn+" "+classes.green} color="primary">{"green" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("yellow")} className={classes.colorBtn+" "+classes.yellow} color="primary">{"yellow" === roleColor ? <Check/> : ""}</Button>
                                        <Button disabled={cantEditRoles || immutableRole} variant="contained" onClick={() => this.handleColorChange("orange")} className={classes.colorBtn+" "+classes.orange} color="primary">{"orange" === roleColor ? <Check/> : ""}</Button>

                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Управление сервером"
                                        secondary="Дает право редактировать сервер"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            onChange={(e,value) => this.handleRoleSwitchChange("server_edit",value)}
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].server_edit === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Управление правами"
                                        secondary="Дает право менять настройки ролей"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("role_edit",value)}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].role_edit === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Отправка сообщений"
                                        secondary="Дает право писать в комнаты"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("msg_send",value)}
                                            checked={ this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].msg_send === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Удаление сообщений"
                                        secondary="Дает право удалять сообщения пользователей с низшими ролями"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("msg_delete",value)}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].msg_delete === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Управление комнатами"
                                        secondary="Дает право создавать, удалять и редактировать комнаты"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("room_edit",value)}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].room_edit === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Участие в игровом процессе"
                                        secondary="Дает право принимать участие в игровом процессе"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("playing",value)}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].playing === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                                <ListItem>
                                    <ListItemText
                                        primary="Управление игровым процессом"
                                        secondary="Дает право одобрять анкеты персонажей, удалять персонажей"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={cantEditRoles || immutableRole}
                                            onChange={(e,value) => this.handleRoleSwitchChange("control_playing",value)}
                                            checked={this.state.roles.length > this.state.currentRole ? this.state.roles[this.state.currentRole].control_playing === 1 : false}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={this.state.tab} index={2}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={this.state.levels}
                            columns={this.levelsColumns}
                            pageSize={100}
                            onEditCellChangeCommitted={this.handleLevelEdit}
                            hideFooterRowCount={true}
                            sortModel={[
                                {
                                    field: 'number',
                                    sort: 'asc',
                                },
                            ]}
                            hideFooter={true}
                            disableSelectionOnClick={true}
                            disableColumnSelector={true}
                            disableColumnFilter={true}
                            localeText={{...Utils.dataGridLocale,noRowsLabel:"Нет уровней"}}
                        />
                    </div><br/>
                    <Button variant="contained" color="primary" onClick={this.handleAddLevel}><Add/></Button>
                </TabPanel>
                <TabPanel value={this.state.tab} index={3}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={this.state.characterClasses}
                            columns={this.classesColumns}
                            pageSize={100}
                            onEditCellChangeCommitted={this.handleClassEdit}
                            hideFooterRowCount={true}
                            hideFooter={true}

                            disableSelectionOnClick={true}
                            disableColumnSelector={true}
                            disableColumnFilter={true}
                            localeText={{...Utils.dataGridLocale,noRowsLabel:"Нет классов"}}
                        />
                    </div><br/>
                    <Button variant="contained" color="primary" onClick={this.handleAddClass}><Add/></Button>
                </TabPanel>
                <TabPanel value={this.state.tab} index={4}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={this.state.abilities}
                            columns={this.abilityColumns}
                            pageSize={100}
                            onEditCellChangeCommitted={this.handleAbilityEdit}
                            hideFooterRowCount={true}
                            hideFooter={true}
                            disableSelectionOnClick={true}
                            disableColumnSelector={true}
                            disableColumnFilter={true}
                            localeText={{...Utils.dataGridLocale,noRowsLabel:"Нет способностей"}}
                        />
                    </div><br/>
                    <Button variant="contained" color="primary" onClick={this.handleAddAbility}><Add/></Button>
                </TabPanel>
                <TabPanel value={this.state.tab} index={5}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={this.state.effects}
                            columns={this.effectsColumns}
                            pageSize={100}
                            onEditCellChangeCommitted={this.handleEditEffect}
                            hideFooterRowCount={true}
                            hideFooter={true}
                            disableSelectionOnClick={true}
                            disableColumnSelector={true}
                            disableColumnFilter={true}
                            localeText={{...Utils.dataGridLocale,noRowsLabel:"Нет эффектов"}}
                        />
                    </div><br/>
                    <Button variant="contained" color="primary" onClick={this.handleAddEffect}><Add/></Button>
                </TabPanel>
                <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} component="span">
                        {btnText}
                    </Button>
                </Grid>
            </DialogContent>
        </Dialog>);
    }
}
const styles = {
    inputFile:{
        display: 'none',
    },
    listIcon:{
        position:"absolute",
        right:"15px"

    },
    dragPlaceholder:{
        height:"56px",
        border:"2px dashed #999"
    },
    rightsList:{
        borderLeft:"1px solid #999"
    },
    listItem:{
        lineHeight:"40px"
    },
    bg:{
      "max-width":"200px"
    },
    tabs:{
        paddingTop:"16px",
        paddingBottom:"16px",
    },
    avatar:{
        "margin-right":"30px"
    },
    colorBtn:{
        height:"35px",
        minWidth:"35px",
        width:"35px",
        marginRight:"10px"
    },
    ...Utils.colors,
    redText:{
        color:red[400]
    },
    pinkText:{
        color:pink[400],
    },
    purpleText:{
        color:purple[400],
    },
    limeText:{
        color:lime[400],
    },
    blueText:{
        color:blue[400],
    },
    cyanText:{
        color:cyan[400],
    },
    greenText:{
        color:green[400],
    },
    yellowText:{
        color:yellow[400],
    },
    orangeText:{
        color:orange[400],
    }
};
export default withStyles(styles)(AddServerDialog);