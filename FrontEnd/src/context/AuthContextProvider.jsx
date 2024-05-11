import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null);
export default function AuthContextProvider({children}) {


    const [admin,setAdmin] = useState({})

    async function getAdmin  (token) {
      try {
          let res = await fetch(process.env.REACT_APP_URL_AUTH+'me',{
              headers:{'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token}
          });

          if(res){
              let json = await res.json();
              setAdmin((prev) =>{
                  return prev = json;
              });
              return json;
          }
      } catch (error) {
          
      }
  }
    

const value = {
    admin,
    setAdmin,
    getAdmin
}

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
