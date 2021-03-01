import { useCallback, useState } from 'react';
type Element = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
const useInput = <T = string | number>(
  initialValue: T
): [T, (event: Element) => void, React.Dispatch<T>] => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e: Element) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue];
};
export default useInput;
