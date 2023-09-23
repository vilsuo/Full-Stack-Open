
const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ parts }) => {
    return (
        <>
            {parts.map(part => 
                <Part key={part.id} part={part}/>
            )}
        </>
    )
}

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Summary = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <strong>
            total of {total ? total : 0} exercises
        </strong>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Summary parts={course.parts}/>
        </>
    )
}

export default Course