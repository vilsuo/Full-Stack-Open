import axios from 'axios';
import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/diagnoses`);
  return data;
};

const getDiagnosis = async (code: string) => {
  const { data } = await axios.get(`${apiBaseUrl}/diagnoses?code=${code}`);

  return data;
};

export default {
  getAll,
  getDiagnosis
};