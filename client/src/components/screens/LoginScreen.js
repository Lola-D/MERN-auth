import React, {useEffect, useState} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import "./LoginScreen.css"

const LoginScreen = ({history}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const loginHandler = async (e) => {
    e.preventDefault();
    
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    
    try {
      const {data} = await axios.post('/api/auth/login', {
        email, password
      }, config)
      
      localStorage.setItem('authToken', data.token)
      
      history.push('/')
    } catch (error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }
  
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/');
    }
  }, [history])
  
  return (
    <div className="register-screen">
      <form onSubmit={loginHandler} className="register-screen__form">
        <h3 className="register-screen__title">Register</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password
            <Link to="/forgotpassword" tabIndex={4} className="login-screen__forgotpassword"> Forgot Password?</Link>
          </label>
          <input
            type="password"
            required
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </div>
        <button type="submit" tabIndex={3} className="btn btn-primary">Login</button>
        <span className="login-screen__subtext">Do not have an account?
          <Link to="/register"> Register</Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;