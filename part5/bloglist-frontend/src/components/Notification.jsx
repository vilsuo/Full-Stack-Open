import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'
const Notification = () => {
  const status = useSelector((state) => state.notification)
  if (status === null) {
    return null
  }

  return (
    <div>
      {(status &&
        <Alert variant={status.type === 'success' ? 'success' : 'danger'}>
          {status.message}
        </Alert>
      )}
    </div>
  )
}

export default Notification
