import {blue, cyan, green, lime, orange, pink, purple, red, yellow} from "@material-ui/core/colors";

class Utils{

    static uploadDir = "https://rp-ruler.ru/upload/";

    static dataGridLocale = {
        noRowsLabel:"Нет анкет",
        columnMenuFilter: 'Фильтр',
        columnMenuHideColumn: 'Скрыть',
        columnMenuShowColumns: 'Показать все',
        columnMenuUnsort: 'Отключить сортировку',
        columnMenuSortAsc: 'Сортировать по возрастанию',
        columnMenuSortDesc: 'Сортировать по убыванию',
    };

    static getElById(arr,id){
        if(arr === undefined)return null;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id)return arr[i];
        }
        return null;
    }
    static truncateString(str, num) {
        if(str == null)return  null;
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }
    static removeElById(arr,id){
        for(let i=0;i<arr.length;i++){
            if(arr[i].id === id){
                arr.splice(i,1);
                return arr;
            }
        }
    }

    static colors = {

        red:{
            background:red[600],
            '&:hover':{
                background:red[800],
            }
        },
        pink:{
            background:pink[600],
            '&:hover':{
                background:pink[800],
            }
        },
        purple:{
            background:purple[600],
            '&:hover':{
                background:purple[800],
            }
        },
        lime:{
            background:lime[600],
            '&:hover':{
                background:lime[800],
            }
        },
        blue:{
            background:blue[600],
            '&:hover':{
                background:blue[800],
            }
        },
        cyan:{
            background:cyan[600],
            '&:hover':{
                background:cyan[800],
            }
        },
        green:{
            background:green[600],
            '&:hover':{
                background:green[800],
            }
        },
        yellow:{
            background:yellow[600],
            '&:hover':{
                background:yellow[800],
            }
        },
        orange:{
            background:orange[600],
            '&:hover':{
                background:orange[800],
            }
        },
    }
}
export default Utils;