import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {getUserById, editUser } from '../api';
import swal from 'sweetalert';

const SingleUser = (props) => {
    const [ singleUser, setSingleUser] = useState({});
  
    const {userId} = useParams();
    const {user} = props;

    const [ updateUserId, setUpdateUserId]  = useState(0)
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ imageurl, setImageURL ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ isAdmin, setIsAdmin ] = useState(false)
    const [ updateUser, setUpdateUser ] = useState(false)

    const history = useHistory();
    
    const fetchUser = async () => {
      try {
        const userInfo = await getUserById(userId);
        setSingleUser(userInfo);
      } catch (error) {
        console.error(error);
      }
    };
    
    useEffect(() => {
      fetchUser();
    }, [updateUser])
    
    const handleUserForm = (e) => {
      e.preventDefault();
      setUpdateUser(true)
      updateUser ? setUpdateUser(false) : setUpdateUser(true);
    };

    const handleEdit = async (event) => {
      event.preventDefault();
      try {
        await editUser(updateUserId, firstName, lastName, email, imageurl, username, password, isAdmin);
        setUpdateUser(false)
        history.push('/users')
        swal({
          title: "Success!",
          text: "Changes saved",
          icon: "success",
        });
      } catch (error) {
        console.error(error)
      }
  };

  return (
    <div>
      <h1 style={{marginTop: "2em"}}>User Information</h1>
      <div className="userCard">
      {
      user && user.isAdmin &&
      <>
          <div className="userContainer">
          <p>User ID: {singleUser.id}</p>
          { singleUser.imageurl ?
              <p>Profile Image:<br/> <img src={singleUser.imageurl} alt={singleUser.username} width="250" height="250"></img></p>
              : <p><img src='https://picsum.photos/200' alt={singleUser.username} width="250" height="250"></img></p>
          }
            <div className="firstName">
            <p>First Name: {singleUser.firstName}</p>
            </div>
            <div className="lastName">
            <p>Last Name: {singleUser.lastName}</p>
            </div>
            <div className="email">
            <p>Email: {singleUser.email}</p>
            </div>
            <div className="username">
            <p>Username: {singleUser.username}</p>
            </div>
            <div className="isAdmin">
            <p>IsAdmin: {singleUser.isAdmin? 'yes' : 'no'} </p>  
            </div>
            
            <button id={singleUser.id} className="editSingleUser" 
                onClick={handleUserForm}>Edit User</button>
          </div>
              { updateUser &&
                <form className="editUserInfo" onSubmit={handleEdit}> 
                <label>First Name:</label>
                <input type="text" required placeholder={'First Name'} title="Please provide a first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <label>Last Name:</label>
                <input type="text" required placeholder={'Last Name'} title="Please provide a last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                <label>Email Address:</label>
                <input type="email" required pattern="[^ @]*@[^ @]*" title="Please provide an address email" placeholder={'email'} value={email} onChange={(event) => setEmail(event.target.value)} />
                <label>Username:</label>
                <input type="text" required title="Please provide a username" placeholder={'username'} value={username} onChange={(event) => setUsername(event.target.value)} />
                <label>Password:</label>
                <input type="password" required minLength="8" title="Password must be at least 8 or more characters" placeholder={'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
                <label>Image URL:</label>
                <input type="text" placeholder={'Image URL'} value={imageurl} onChange={(event) => setImageURL(event.target.value)} />
                <label>Is Admin?:</label>
                <select value={ isAdmin} 
                        style={{width: "50px"
                        }}
                        onChange={(event) => {setIsAdmin(event.target.value)}}
                        name="isAdmin">
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                </select>
                <button onClick={()=> {setUpdateUserId(singleUser.id) }} 
                      className="editButton">Update User</button>
                </form>
              }
      </>
      } 
      </div>
  
    </div>
  );
}


export default SingleUser;