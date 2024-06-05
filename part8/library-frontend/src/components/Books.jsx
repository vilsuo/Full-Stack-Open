import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useEffect, useState } from "react";

const NO_FILTER = "";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState(NO_FILTER);

  useEffect(() => {
    if (!result.data || !result.data.allBooks) { return; }

    const books = result.data.allBooks;

    const newGenres = books
      .map(book => book.genres)
      .reduce((accum, current) => {
        for (const i in current) {
          const genre = current[i];
          if (accum.find(p => p === genre) === undefined) {
            accum = [ ...accum, genre ]
          }
        }
        return accum;
      }, []);

    setGenres(newGenres);

  }, [result.data])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return "Loading...";
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <div>
        Filter by genre:
        <select
          value={filter}
          onChange={({ target }) => { setFilter(target.value); } }
        >
          <option value={NO_FILTER}>
            All genres
          </option>

          {genres.map(genre => 
            <option key={genre} value={genre}>
              {genre}
            </option>
          )}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((a) => (filter === NO_FILTER) || a.genres.find(genre => genre === filter))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Books
