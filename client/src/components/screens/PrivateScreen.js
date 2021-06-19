import React, {useEffect, useState} from 'react';
import axios from 'axios';

const PrivateScreen = ({ history}) => {
  const [error, setError] = useState('');
  const [privateData, setPrivateData] = useState('');
  
  const logoutHandler = () => {
    localStorage.removeItem('authToken')
    history.push('/login')
  }

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login')
    }

    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, [history]);
  
  if (error) return <span className="error-message">{error}</span>

  return error ? (
      <span className="error-message">{error}</span>
    ) : (
      <>
      <div styme={{ backgroundColor: 'green', color: 'white'}}>
        {privateData}
      </div>
        <button onClick={logoutHandler}>Logout</button>
      </>
  );
};

export default PrivateScreen;