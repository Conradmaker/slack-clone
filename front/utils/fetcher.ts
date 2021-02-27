import axios from 'axios';

const fetcher = <T = unknown>(url: string): Promise<T> =>
  axios
    .get<T>(url, { withCredentials: true })
    .then(res => res.data);
export default fetcher;
