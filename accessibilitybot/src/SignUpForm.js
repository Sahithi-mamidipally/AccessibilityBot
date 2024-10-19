import React, { useState } from 'react';
import './style.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './firebase';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ isNightMode }) => {
    const [userid, setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const auth = getAuth(app);
    const db = getFirestore(app);  
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                userid: userid,
                email: email
            });

            setMessage('Registration successful! Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (error) {
            setMessage(`Failed to register: ${error.message}`);
        }
    };

    return (
        <div className={`signup-container ${isNightMode ? 'night-mode' : 'bright-mode'}`}>
            <h1 className="website-title">ACCESSIBILITY BOT</h1> {/* Website title above form */}
            <form className={`signup-form ${isNightMode ? 'night-mode' : 'bright-mode'}`} onSubmit={handleSignUp}>
                <h2>CREATE ACCOUNT</h2>
                {message && <p className="feedback">{message}</p>}
                
                <input 
                    type="text" 
                    value={userid} 
                    onChange={(e) => setUserID(e.target.value)} 
                    placeholder="User ID" 
                    required 
                />

                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email ID" 
                    required 
                />

                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create Password" 
                    required 
                />

                <button type="submit">SIGN UP</button>
                <p>Already have an account? <a href="/login">Login here</a></p>
            </form>
        </div>
    );
}

export default SignUpForm;
