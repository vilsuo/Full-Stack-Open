import { useState } from 'react'
import { DiaryEntry,  Visibility, Weather } from '../types'
import ErrorMessage from './ErrorMessage';
import diaryService from '../services/diaryService';

interface RadioButtonGroupProps<T extends string> {
  name: string
  data: T[];
  setData: React.Dispatch<React.SetStateAction<"" | T>>
}

function RadioButtonGroup<T extends string> ({ name, data, setData }
  : RadioButtonGroupProps<T>) {

  return (
    <div>
      <span style={{ marginRight: 10 }}>
        {name}
      </span>
      {data.map((value, index) =>
        <label key={index}>
          <span style={{ marginLeft: 10 }}>
            {value}
          </span>
          <input
            type='radio'
            name={name}
            onChange={() => setData(value)}
          />
        </label>
      )}
    </div>
  );
}

interface DiaryFormProps {
  addDiary: (diary: DiaryEntry) => void;
}

const DiaryForm = ({ addDiary }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [comment, setComment] = useState('');

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const obj = { date, visibility, weather, comment };
    console.log('obj to be created', obj);

    try {
      const diary = await diaryService.create(obj);
      addDiary(diary);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message)

        setTimeout(() => {
          setMessage(null)
        }, 5000);
      } else {
        console.log('unknown error');
      }
    }
  }

  return (
    <div>
      <ErrorMessage message={message} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            date
            <input
              type='date'
              value={date}
              onChange={ (event) => setDate(event.target.value) }
            />
          </label>
        </div>
        <RadioButtonGroup
          name='visibility'
          data={Object.values(Visibility)}
          setData={setVisibility}
        />
        <RadioButtonGroup
          name='weather'
          data={Object.values(Weather)}
          setData={setWeather}
        />
        <div>
          <label>
            comment
            <input
              type='text'
              value={comment}
              onChange={ (event) => setComment(event.target.value) }
            />
          </label>
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </div>
  )
};

export default DiaryForm;
