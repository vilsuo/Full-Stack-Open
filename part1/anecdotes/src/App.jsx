import { useState } from 'react'

const Anectode = ({title, anecdote, votes}) => {
  return (
    <>
      <h1>{title}</h1>
      {anecdote}
      <p>has {votes ? votes : 0} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  let max = 0
  let most_popular = 0
  for (const index in votes) {
    if (votes[index] >= max) {
      most_popular = index
      max = votes[index]
    }
  }

  const getRandomAnectode = () => {
    const rand = Math.random() * anecdotes.length
    const randInt = Math.floor(rand)
    setSelected(randInt)
  }

  const vote = () => {
    const copy = {...votes}
    if (!copy[selected]) {
      copy[selected] = 0
    }
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <Anectode 
        title={"Anecdote of the day"}
        anecdote={anecdotes[selected]}
        votes={votes[selected]}/>
      <button onClick={vote}>
        vote
      </button>
      <button onClick={getRandomAnectode}>
        next anecdote
      </button>
      <Anectode 
        title={"Anecdote with most votes"}
        anecdote={anecdotes[most_popular]}
        votes={votes[most_popular]}/>
    </div>
  )
}

export default App