import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState("");
  const client = useApolloClient();

  const handleLogout = async () => {
    showPlank();

    setToken("");
    localStorage.clear();
    await client.clearStore();
  };

  const showPlank = () => setPage("");

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { token && <button onClick={() => setPage("add")}>add book</button> }
        { !token
          ? <button onClick={() => setPage("login")}>login</button>
          : <button onClick={handleLogout}>logout</button>
        }
      </div>

      <Authors show={page === "authors"} showEdit={!!token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} redirect={showPlank} />
    </div>
  );
};

export default App;
