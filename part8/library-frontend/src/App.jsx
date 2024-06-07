import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";
import Recommend from "./components/Recommend";

const App = () => {
  const [page, setPage] = useState("authors");
  const [user, setUser] = useState();
  const client = useApolloClient();

  const handleLogout = async () => {
    showPlank();
    setUser();

    localStorage.clear();
    await client.clearStore();
  };

  const showPlank = () => setPage("");

  const genre = user ? user.favoriteGenre : undefined;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { user && (<>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={() => setPage("recommend")}>recommend</button>
        </>)}
        { !user
          ? <button onClick={() => setPage("login")}>login</button>
          : <button onClick={handleLogout}>logout</button>
        }
      </div>

      <Authors show={page === "authors"} showEdit={!!user} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} genre={genre} />

      <Recommend show={page === "recommend"} genre={genre} />

      <Login show={page === "login"} setUser={setUser} redirect={showPlank} />
    </div>
  );
};

export default App;
