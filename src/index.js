import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BASE_URL } from './requests';


const root = ReactDOM.createRoot(document.getElementById('root'));
const url = `${BASE_URL}/api/config`
fetch(url).then(response => response.json()).then(data => {
  root.render(
    <GoogleOAuthProvider clientId={data.googleClientId} >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
}).catch(() => {
  root.render(
    <GoogleOAuthProvider clientId={''} >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
