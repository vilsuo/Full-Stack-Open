import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN, ME } from "../queries";

const Login = ({ show, setUser, redirect }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [me] = useLazyQuery(ME, {
    onCompleted: (data) => {
      setUser(data.me);
      setUsername("");
      setPassword("");
      redirect();
    },
  });

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('Login error', error);
    },
    onCompleted: async (data) => {
      const newToken = data.login.value;
      localStorage.setItem('part8-token', newToken);
      await me();
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
