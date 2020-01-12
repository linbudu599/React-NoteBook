import { useState, useEffect } from "react";

let countInterval = null;

export default function useCountDown(start, end) {
  const [count, setCount] = useState(start);
  const [disabled, setDisabled] = useState(false);

  const interval = () => {
    countInterval = setInterval(() => {
      if (count - 1 === end) {
        clearInterval(countInterval);
        setDisabled(false);
        return;
      }
      setCount(count - 1);
    }, 1000);
  };

  useEffect(() => {
    if (disabled) {
      interval();
    } else {
      setCount(start);
    }
    return () => clearInterval(countInterval);
  }, [count, disabled]);

  return [disabled, setDisabled, count];
}
