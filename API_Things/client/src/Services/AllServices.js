export default {
    
    /*---------------------------------------------------*/
    //                  Friend Services
    /*---------------------------------------------------*/

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
    postFriend : friend=>{
        return fetch('/user/friend',{
            method : "post",
            body : JSON.stringify(friend),
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
    editFriend : friend=>{
        return fetch('/user/friend/:id',{
            method : "put",
            body : JSON.stringify(friend),
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
    deleteFriend : friend=>{
        return fetch('/user/friend/:id',{
            method : "delete",
            body : JSON.stringify(friend),
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

    /*---------------------------------------------------*/
    //                  Favorites Services
    /*---------------------------------------------------*/

    getFavorites : ()=>{
        return fetch('/user/favorites')
                .then(response=>{
                    if(response.status !== 401){
                        return response.json().then(data => data);
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
    postFavorite : friend=>{
        return fetch('/user/favorite',{
            method : "post",
            body : JSON.stringify(friend),
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
    editFavorite : friend=>{
        return fetch('/user/favorite/:id',{
            method : "put",
            body : JSON.stringify(friend),
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
    deleteFavorite : friend=>{
        return fetch('/user/favorite/del/:id',{
            method : "put",
            body : JSON.stringify(friend),
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
    }
}
