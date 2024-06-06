import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (data && data.editAuthor === null) {
        console.log('Author not found');
      } else {
        setBorn("");
      }
    },
    onError: (error) => {
      console.log('Error updating author', error)
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    await editAuthor({ variables: { name, born: Number(born) } });
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select author:
          <select
            value={name}
            onChange={({ target }) => { setName(target.value); } }
          >
            <option disabled value="">-- select an option--</option>
            
            {authors.map(a =>
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            )}
          </select>
        </label>

        <div>
          born <input type="number" value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default EditAuthor;
