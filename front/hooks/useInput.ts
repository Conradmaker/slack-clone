import { useCallback, useState } from 'react';

const useInput = <T = string | number>(
  initialValue: T
): [
  T,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  React.Dispatch<T>
] => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue];
};
export default useInput;
