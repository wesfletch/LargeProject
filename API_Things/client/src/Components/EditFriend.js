import React, {useState,useContext,useEffect} from 'react';
import FriendItem from './FriendItem';
import Message from './Message';
import { AuthContext } from '../Context/AuthContext';
import AllServices from '../Services/AllServices';

const Friends = (props) =>{
    const [friend,setFriend] = useState({name : ""});
    const [friends,setFriends] = useState([]);
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    
    useEffect(()=>{
        AllServices.getFriends().then(data =>{
            setFriends(data.friends);
        });
    },[]);

    const onSubmit = e =>{
        e.preventDefault();
        AllServices.postFriend(friend).then(data =>{
            const { message } = data;
            resetForm();
            if(!message.msgError){
                AllServices.getFriends().then(getData =>{
                    setFriends(getData.friends);
                    setMessage(message);
                });
            }
            else if(message.msgBody === "UnAuthorized"){
                setMessage(message);
                authContext.setUser({email : ""});
                authContext.setIsAuthenticated(false);
            }
            else{
                setMessage(message);
            }
        });
    }

    const onChange = e =>{
        setFriend({name : e.target.value});
    }

    const resetForm = ()=>{
        setFriend({name : ""});
    }

    return(
        <div>
            <ul className="list-group">
                {
                    friends.map(friend =>{
                        return <FriendItem key={friend._id} friend={friend}/>
                    })
                }
            </ul>
            <br/>
            <form onSubmit={onSubmit}>
                <label htmlFor="friend">Enter Friend Information</label>
                <input type="text" 
                       name="friend" 
                       value={friend.name} 
                       onChange={onChange}
                       className="form-control"
                       placeholder="Please Enter Friend's Name"/>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Submit</button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    );

}

export default Friends;