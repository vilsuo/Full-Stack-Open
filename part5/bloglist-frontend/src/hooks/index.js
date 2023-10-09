import { useState } from 'react'

export const useField = (type, id, placeholder) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    inputProps: {
      id,
      type,
      value,
      placeholder,
      onChange,
    },
    reset,
  }
}
