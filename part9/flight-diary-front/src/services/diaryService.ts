import axios from 'axios';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types';

const baseApiUrl = 'http://localhost:3000/api';

const getAll = async () => {
  const { data } = await axios
    .get<NonSensitiveDiaryEntry[]>(`${baseApiUrl}/diaries`);

  return data;
};

const create = async (object: unknown) => {
  try {
    const { data } = await axios
      .post<DiaryEntry>(`${baseApiUrl}/diaries`, object);

    return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data);
    }
    throw new Error('Unknown error happened')
  }
}

export default {
  getAll,
  create
};