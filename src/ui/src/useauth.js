import React, { useState, useEffect, useContext, createContext } from "react";


const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (username, password) => {
    let option = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
        json: true
    }
    return fetch('/api/login', option).then((res) => {
        if(!res.ok) {
          console.error(res)
          throw new Error("failed to login")
        }
        return res.json()
    }).then((body) => {
        console.log(body)
        setUser(body)
        return body
    }).catch((e) => {
      alert(e.message)
    })
  };

  const signup = (email, password) => {
    
  };

  const signout = () => {
    setUser(false);
    return
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.


  // Return the user object and auth methods
  return {
    user,
    signin,
    signout
  };
}