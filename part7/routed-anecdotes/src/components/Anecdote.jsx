import { useParams } from "react-router-dom"

const Anecdote = ({ anecdotes }) => {
  const id = Number(useParams().id)
  const anecdote = anecdotes.find(anecdote => anecdote.id === id)

  if (!anecdote) {
    return <h2>anecdote does not exist</h2>
  }

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

export default Anecdote