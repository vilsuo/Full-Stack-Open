import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../queries";

const Login = ({ show, setToken, redirect }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('Error logging in handler', error);
    },
    onCompleted: (data) => {
      const newToken = data.login.value;
      setToken(newToken);
      localStorage.setItem('part8-token', newToken);

      setUsername("");
      setPassword("");
      redirect();
    }
  });

  if (!show) { return null; }

  const handleLogin = async (event) => {
    event.preventDefault();

    await login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username <input type="text" value={username}
            onChange={({ target }) => { setUsername(target.value); }} 
          />
        </div>

        <div>
          password <input type="password" value={password}
            onChange={({ target }) => { setPassword(target.value); }} 
          />
        </div>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
