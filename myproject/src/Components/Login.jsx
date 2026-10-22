import React from 'react'

const Login = () => {
    const {username,setUsername}=useState("");
    const {pass,setPass}=useState("");
    const {error,setError}=useState("");
    function handleLogin(e){
        e.preventDefault();
        if(username==="admin" && pass==="manager") {
            navigate("/admin")
        }
        else if(username==="user" && pass==="abes") {
            navigate("/user")
        }
        else {
            setError("Authentication Error: Chcek User credentials")
            navigate("/")
        }
    }
  return (
    <div className="login">
        <h1>SignIn here</h1>
        <h2 style={{color:"red"}}>(error)</h2>
        <form onSubmit={handleLogin}>
            UserName:
            <input type="text"
                   value={username}
                   placeholder="Enter the username"
                   onChange={(e)=>setUsername(e.target.value)}/>
                   <br/>
            Password:
            <input type="password"
                   value={pass}
                   placeholder="Enter the password"
                   onChange={(e)=>setPass(e.target.value)}/>
                   <br/>
            <button>SignIn</button>
            <button>Reset</button>              
        </form>
    </div>
  )
}

export default Login