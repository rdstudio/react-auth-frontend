import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from "../../context/UserContact";
import Axios from "axios";
import ErrorNotice from '../misc/ErrorNotice';

export default function Register() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [error, setError] = useState();
    
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();

        try {

            const newUser = { email, password, passwordCheck, displayName };
            await Axios.post('http://localhost:5000/users/register', newUser);

            const loginRes = await Axios.post('http://localhost:5000/users/login', { email, password });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            });

            localStorage.setItem("auth-token", loginRes.data.token);
            history.push('/');
        } catch (err) {
            console.log(err);
            err.response.data.msg && setError( err.response.data.msg );
        }
    }


    return (
        <div className="page">
            <h2>Register</h2>
            { error && (
                <ErrorNotice message={ error } clearError={ () => setError(undefined)} />
            )}
            <form className="form" onSubmit={ submit }>
                <label htmlFor="register-email">Email</label>
                <input type="email" id="register-email" onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="register-password">Password</label>
                <input type="password" id="register-password" onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Verify Password" onChange={(e) => setPasswordCheck(e.target.value)} />

                <label htmlFor="register-display-name">Display Name</label>
                <input type="text" id="register-display-name" onChange={(e) => setDisplayName(e.target.value)} />

                <input type="submit" value="Register" />
            </form>
        </div>
    )
}

