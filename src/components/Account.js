import React from 'react';

const Account = (props) => {
    const {user} = props;
    console.log("account user:", user)

    return (
        <>
            <h1>{user.username}'s Account</h1>
            { user.imageurl ?
            <div><img src={user.imageurl} alt={user.username} width="250" height="250"></img></div>
             : <div><img src='https://picsum.photos/200' alt={user.username} width="250" height="250"></img></div>
            }
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.email}</p>
            <div>{
                user.isAdmin 

                ? <p>Is Admin: Yes</p>

                : <p>Is Admin: No</p>
            
            }</div>
        </>

    )

}

export default Account;