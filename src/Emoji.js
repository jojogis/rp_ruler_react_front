import * as React from "react";
import {Button, Fade, Popover, withStyles} from "@material-ui/core";
import {Picker} from "emoji-mart";
import {Mood} from "@material-ui/icons";

class Emoji extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open:false,
            anchorEl:null,
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleButtonClick(event){
        this.setState({
            anchorEl:event.currentTarget,
            open:true
        });
    }
    handleClose(){
        this.setState({open:false});
    }


    render() {
        const {classes} = this.props;
        return (<div><Button onClick={this.handleButtonClick} className={classes.emojiButton}><Mood/></Button>
            <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <Picker
                native={true}

                theme={this.props.isDarkTheme ? "dark" : "light"}
                color="#ff5722"
                defaultSkin={6}
                title=""
                disableSkinTonePicker={true}
                onSelect={this.props.onSelect}
                emoji='point_up'
                showPreview={false}
                i18n={{search: 'Поиск',
                    clear: 'Очистить',
                    notfound: 'Не найдено',
                    skintext: 'Нигер?',
                    categories: {
                        search: 'Результаты',
                        recent: 'Любимые смайлики',
                        smileys: 'Эмоции',
                        people: 'Люди',
                        nature: 'Не люди',
                        foods: 'Хавчик',
                        activity: 'Спорт',
                        places: 'Путешествия',
                        objects: 'Предметы',
                        symbols: 'Символы',
                        flags: 'Флаги',
                        custom: 'Кастом',
                    },
                    categorieslabel: 'Категории', // Accessible title for the list of categories
                    skintones: {
                        1: 'Китаец',
                        2: 'Ариец',
                        3: 'Не совсем ариец',
                        4: 'Полу нигер',
                        5: 'Нигер',
                        6: 'Самый нигерный нигер',
                    }}}
            />

        </Popover></div>);
    }
}
const styles = {
    emojiButton:{
        position:"absolute",
        bottom:"10px",
        right:"69px",
        opacity:0.7
    },
};
export default withStyles(styles)(Emoji);