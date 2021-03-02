import { IChat, IDM } from '../types/db';
import dayjs from 'dayjs';

export default function makeSection<T extends IDM | IChat>(
  chatList: T[]
): { [key: string]: T[] } {
  const sections: { [key: string]: T[] } = {};
  chatList.forEach(chat => {
    const monthDate = dayjs((chat as IDM).createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
