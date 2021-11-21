import React, {useState,useContext,useEffect} from 'react';
import { Link } from 'react-router-dom'
import AllServices from '../Services/AllServices';
import FavoriteItem from './FavoriteItem';
import FriendItem from './FriendItem';
import { AuthContext } from '../Context/AuthContext';
import Message from './Message';

const Landing = (props)=>{

    const [friends,setFriends] = useState([]);
    const [favorites,setFavorites] = useState([]);
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    
    useEffect(()=>{
        AllServices.getFriends().then(data =>{
            setFriends(data.friends);
        });
        AllServices.getFavorites().then(data2 =>{
            setFavorites(data2.favorites);
        });
    },[]);

    return (
        <div>
            <h2>List of Friends</h2>
            <ul style={{listStyleType:"none"}}>
                {friends.map(friend => {
                    return (<li key={friend._id}><Link to={`/user/friend/${friend._id}`}>{friend.name}</Link></li>)
                })}
            </ul>
            <br/>
            <br/>
            <h2>List of Favorites</h2>
            <ul style={{listStyleType:"none"}}>
                {favorites.map(favorite =>{
                        return <FavoriteItem key={favorite._id} favorite={favorite}/>
                    })}
               <li key={favorites._id}> <Link to={`/user/favorite/${favorites._id}`}>Edit Favorites</Link></li>
            </ul>
            
           
        </div>
    )
}
export default Landing