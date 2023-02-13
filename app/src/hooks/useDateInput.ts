import { useRef, useState, useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";

export default function useDateInput(
  setValue: UseFormSetValue<{ date: string }>,
  initiallyOff = false
) {
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentDateAndTime, setCurrentDateAndTime] = useState(
    initiallyOff ? false : true
  );

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (!currentDateAndTime) return;

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setValue("date", now.toISOString().substring(0, 16));

    interval.current = setInterval(() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setValue("date", now.toISOString().substring(0, 16));
    }, 1000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [currentDateAndTime, setValue]);

  return {
    currentDateAndTime,
    setCurrentDateAndTime,
  };
}
