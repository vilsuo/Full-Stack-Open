import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const EditAuthor = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onCompleted: (data) => {
      if (data && data.editAuthor === null) {
        console.log('Author not found');
      } else {
        setName("");
        setBorn("");
      }
    },
    onError: (error) => {
      console.log('Error updating author', error)
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    await editAuthor({ variables: { name, born: Number(born) } });
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name <input type="text" value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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
