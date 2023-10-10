import { Accordion } from 'react-bootstrap'

const Toggable = (props) => {
  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {props.text}
          </Accordion.Header>
          <Accordion.Body>
            {props.children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default Toggable
