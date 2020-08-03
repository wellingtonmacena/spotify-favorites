import React from 'react';

function App(props) {
   
  function login(){
      window.location.href = "https://spotify-favorites-helper.herokuapp.com"
    }

  return (
    
    <div className="App">

    <button onClick={()=> login()}>Login</button>
    </div>
      
   
  );
}

export default App ;