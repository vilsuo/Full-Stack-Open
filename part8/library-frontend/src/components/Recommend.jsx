import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Recommend = ({ show, genre }) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  if (!show) { return null; }

  if (!result.data || result.data.loading) { return "loading..."; }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>Recommendations</h2>

      <p>books in your favorite genre <strong>{genre}</strong></p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
