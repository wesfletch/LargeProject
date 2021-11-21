import React, {useState,useRef,useEffect} from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';

const Register = props=>{
    const [user,setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [message,setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const resetForm = ()=>{
        setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        });
    }

    const onSubmit = e =>{
        e.preventDefault();
        AuthService.register(user).then(data=>{
            const { message } = data;
            setMessage(message);
            resetForm();
            if(!message.msgError){
                timerID = setTimeout(()=>{
                    props.history.push('/login');
                },2000)
            }
        });
    }



    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please Register</h3>
                <label htmlFor="firstname" className="sr-only">First Name: </label>
                <input type="text" 
                       name="firstname" 
                       value={user.firstname}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter First Name"/>
                <label htmlFor="lastname" className="sr-only">Last Name: </label>
                <input type="text" 
                       name="lastname" 
                       value={user.lastname}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Last Name"/>
                <label htmlFor="email" className="sr-only">Email: </label>
                <input type="text" 
                       name="email" 
                       value={user.email}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Email"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password"
                       value={user.password} 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Register</button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Register;