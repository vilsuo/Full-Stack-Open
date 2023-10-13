import { NonSensitiveDiaryEntry } from "../types";

interface DiaryProps {
  diary: NonSensitiveDiaryEntry;
}

const Diary = ({ diary } : DiaryProps) => {
  return (
    <div>
      <h3>{diary.date}</h3>
      visibility: {diary.visibility}<br/>
      weather: {diary.weather}
    </div>
  )
}

interface DiaryListProps {
  diaries: NonSensitiveDiaryEntry[]
}

const DiaryList = (props: DiaryListProps) => {
  return (
    <div>
      <h2>diary entries</h2>
      {props.diaries.map(diary =>
        <Diary
          key={diary.id}
          diary={diary}
        />
      )}
    </div>
  )
}

export default DiaryList