import { useState } from 'react'

const Button = ({text, action}) => {
  return (
    <button value="button" onClick={action}>
      {text}
    </button>
  )
}

const Feedback = ({ actions }) => {
  return (
    <>
      <h1>give feedback</h1>
      <Button text={"good"}     action={actions.good}/>
      <Button text={"neutral"}  action={actions.neutral}/>
      <Button text={"bad"}      action={actions.bad}/>
    </>
  )
}

const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const Statistics = ({ statistics }) => {
  const good = statistics.good;
  const neutral = statistics.neutral;
  const bad = statistics.bad;

  let n = good + neutral + bad
  let sum = good - bad
  
  if (n) {
    return (
      <>
        <h1>statistics</h1>
        <StatisticLine text="good"    value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad"     value={bad}/>
        <p>all {n}</p>
        <p>average {sum/n}</p>
        <p>positive {100 * good / n} %</p>
      </>
    )
  } else {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const statistics = {
    good : good,
    neutral : neutral,
    bad : bad
  }

  const actions = {
    good : () => setGood(good + 1),
    neutral :  () => setNeutral(neutral + 1),
    bad : () => setBad(bad + 1)
  }

  return (
    <div>
      <Feedback actions={actions}/>
      <Statistics statistics={statistics}/>
    </div>
  )
}

export default App