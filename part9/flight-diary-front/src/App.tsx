import { useState, useEffect } from 'react'
import {
  NonSensitiveDiaryEntry,
  DiaryEntry
} from './types'

import diaryService from './services/diaryService';
import DiaryForm from './components/DiaryForm';

import DiaryList from './components/DiaryList';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    diaryService
      .getAll()
      .then(setDiaries);
  }, []);

  const addDiary = (diary: DiaryEntry) => setDiaries(diaries.concat(diary));

  return (
    <div>
      <DiaryForm addDiary={addDiary} />
      <DiaryList diaries={diaries} />
    </div>
  )
};

export default App;
