export default {
    
    /*---------------------------------------------------*/
    //                  User Services
    /*---------------------------------------------------*/
    
    register : user =>{
        console.log(user);
        return fetch('/user/register',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },
    login : user =>{
        console.log(user);
        return fetch('/user/login',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated : false, user : {email : ""}};
        })
    },
    logout : ()=>{
        return fetch('/user/logout')
                .then(res => res.json())
                .then(data => data);
    },
    isAuthenticated : ()=>{
        return fetch('/user/authenticated')
                .then(res=>{
                    if(res.status !== 401)
                        return res.json().then(data => data);
                    else
                        return { isAuthenticated : false, user : {email : ""}};
                });
    },
    updateUser : user =>{
        console.log(user);
        return fetch('/update/:id',{
            method : "put",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { message : {msgBody : "UnAuthorized",msgError : true}};
        })
    },
    forgotPassword : email =>{
        console.log(email);
        return fetch('/forgot',{
            method : "post",
            body : JSON.stringify(email),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { message : {msgBody : "UnAuthorized",msgError : true}};
        })
    },
    resetPassword : ()=>{
        return fetch('/reset/:resetToken')
                .then(res => res.json())
                .then(data => data);
    },
    verifyEmail : ()=>{
        return fetch('/verify/:verifyToken')
                .then(res => res.json())
                .then(data => data);
    },
    resendEmail : email =>{
        console.log(email);
        return fetch('/forgot',{
            method : "put",
            body : JSON.stringify(email),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { message : {msgBody : "UnAuthorized",msgError : true}};
        })
    },
    
    /*---------------------------------------------------*/
    //                  Friend Services
    /*---------------------------------------------------*/

    addFriend : email=>{
        return fetch('/user/add',{
            method : "post",
            body : JSON.stringify(email),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },
    getFriends : ()=>{
        return fetch('/user/friends')
                .then(response=>{
                    if(response.status !== 401){
                        return response.json().then(data => data);
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
    deleteFriend : id=>{
        return fetch('/user/friend/'+'/' + id,{
            method : "delete"
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },

    /*---------------------------------------------------*/
    //                  Playlist Services
    /*---------------------------------------------------*/

    postFavorite : playlist=>{
        return fetch('/user/favorite',{
            method : "post",
            body : JSON.stringify(playlist),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },
    getPlaylists : ()=>{
        return fetch('/user/addplaylist')
                .then(response=>{
                    if(response.status !== 401){
                        return response.json().then(data => data);
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
    editPlaylist : id=>{
        return fetch('/user/playlist'+'/'+id,{
            method : "put",
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },
    deletePlaylist : id=>{
        return fetch('/user/playlist'+'/'+id,{
            method : "delete",
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },

    /*---------------------------------------------------*/
    //                   Spotify Services
    /*---------------------------------------------------*/

    getArtist : ()=>{
        return fetch('/fetch/artist')
                .then(response=>{
                    if(response.status !== 401){
                        return response.json().then(data => data);
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
}
