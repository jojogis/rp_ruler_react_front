class Utils{

    static uploadDir = "https://rp-ruler.ru/upload/";

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
}
export default Utils;