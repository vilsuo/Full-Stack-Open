
const Notification = ({ message, color }) => {
    if (message === null) {
      return null
    }

    const style = {
        color: "red",
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: color
    }
  
    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Notification