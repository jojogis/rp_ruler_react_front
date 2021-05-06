import AppContext from "./AppContext";

class Api{
    location = 'https://rp-ruler.ru/';

    async getRooms(token,serverId){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"rooms?serverId="+serverId,requestOptions).then(response => response.json());
    }

    async getRole(token,serverId){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"roles?serverId="+serverId,requestOptions).then(response => response.json());
    }

    async getRoomWithUser(token,userId){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"room_with_user?userId="+userId,requestOptions).then(response => response.json());
    }

    async deleteRoom(token,roomId){
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"rooms?roomId="+roomId,requestOptions).then(response => response.json());
    }

    async changeAlert(token,roomId){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token,

            },
            body:"roomId="+roomId
        };
        return await fetch(this.location+"change_alert",requestOptions).then(response => response.json());
    }

    async deleteCategory(token,categoryId){
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"categories?categoryId="+categoryId,requestOptions).then(response => response.json());
    }

    async addCategory(token,name,serverId){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"serverId="+serverId+"&name="+name
        };
        return await fetch(this.location+"categories",requestOptions).then(response => response.json());
    }

    async editCategory(token,name,categoryId){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"categoryId="+categoryId+"&name="+name
        };
        return await fetch(this.location+"categories",requestOptions).then(response => response.json());
    }

    async disconnectFromServer(token,serverId){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"serverId="+serverId
        };
        return await fetch(this.location+"disconnect_from_server",requestOptions).then(response => response.json());
    }

    async getServers(token){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"servers_of_user",requestOptions).then(response => response.json());
    }

    async getUsersInRoom(token,roomId){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"users_in_room?roomId="+roomId,requestOptions).then(response => response.json());
    }

    async getMessages(token,roomId,offset){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"messages?roomId="+roomId+"&offset="+offset,requestOptions).then(response => response.json());
    }

    async readMessage(token,roomId,messageId){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"roomId="+roomId+"&messageId="+messageId
        };
        return await fetch(this.location+"messages_read",requestOptions).then(response => response.json());
    }

    async addRoom(token,serverId,name,description,icon,bg){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"serverId="+serverId+"&name="+name+"&description="+description+"&icon="+icon+"&bg="+bg
        };
        return await fetch(this.location+"rooms",requestOptions).then(response => response.json());
    }

    async editRoom(token,serverId,roomId,name,description,icon,bg){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"serverId="+serverId+"&roomId="+roomId+"&name="+name+"&description="+description+"&icon="+icon+"&bg="+bg
        };
        return await fetch(this.location+"rooms",requestOptions).then(response => response.json());
    }

    async getUsersOnServer(token,serverId){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"users_on_server?serverId="+serverId,requestOptions).then(response => response.json());
    }

    async deleteServer(token,serverId){
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"servers?serverId="+serverId,requestOptions).then(response => response.json());
    }
    async getAllServers(token,s){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"servers?s="+s,requestOptions).then(response => response.json());
    }

    async connectToServer(token,serverId){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"connect_to_server?serverId="+serverId,requestOptions).then(response => response.json());
    }

    async addServer(token,age,name,description,avatar,isPrivate,bg,tags,roles){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"&age="+age+"&name="+name+"&description="+description+"&avatar="+avatar+
                "&is_private="+isPrivate*1+"&bg="+bg+"&tags="+tags+"&roles="+encodeURI(JSON.stringify(roles))
        };
        return await fetch(this.location+"servers",requestOptions).then(response => response.json());
    }

    async editServer(token,serverId,age,name,description,avatar,isPrivate,bg,tags,roles){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body:"&age="+age+"&name="+name+"&description="+description+"&avatar="+avatar+
                "&isPrivate="+isPrivate*1+"&bg="+bg+"&tags="+tags+"&serverId="+serverId+"&roles="+encodeURI(JSON.stringify(roles))
        };
        return await fetch(this.location+"servers",requestOptions).then(response => response.json());
    }

    async login(login,password){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+login+"&password="+password
        };
        return await fetch(this.location+"login_api",requestOptions).then(response => response.json());

    }

    async register(login,password,email){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "login="+login+"&password="+password+"&email="+email
        };
        return await fetch(this.location+"register_api",requestOptions).then(response => response.json());
    }

    async getProfile(token){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"profile",requestOptions).then(response => response.json());
    }

    async editProfile(token,login,status,prevPass,newPass){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body: "login="+ (login ?? "null") +"&status="+ (status ?? "null") + "&prevPass="+ (prevPass ?? "null") +"&newPass=" + (newPass ?? "null")
        };
        return await fetch(this.location+"profile",requestOptions).then(response => response.json());
    }

    async setRoomCategory(token,roomId,categoryId,order){
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
            body: "roomId="+roomId+"&categoryId="+categoryId+"&order="+order
        };
        return await fetch(this.location+"set_category_of_room",requestOptions).then(response => response.json());
    }

    async deleteAccount(token){
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            }
        };
        return await fetch(this.location+"users",requestOptions).then(response => response.json());
    }

    async uploadAvatar(token,avatar){
        const formData = new FormData();
        formData.append('avatar', avatar);
        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization' : 'Bearer '+token
            },
        };
        return await fetch(this.location+"upload_avatar",requestOptions).then(response => response.json());
    }

    async uploadFile(token,file){
        const formData = new FormData();
        formData.append('file', file);
        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization' : 'Bearer '+token
            },
        };
        return await fetch(this.location+"upload_file",requestOptions).then(response => response.json());
    }

    async checkToken(token){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'Bearer '+token
            },
        };
        return await fetch(this.location+"check_token",requestOptions).then(response => response.json());
    }


}
export default new Api()