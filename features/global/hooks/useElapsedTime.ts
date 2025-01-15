import { useState, useEffect } from 'react';

export function useElapsedTime() {
  function normalizeDateTime(dateTimeStr: string) {
    let normalized = dateTimeStr.replace(' ', 'T');
    const signIndex = Math.max(normalized.lastIndexOf('+'), normalized.lastIndexOf('-'));
    if (signIndex > 0) {
      const offset = normalized.substring(signIndex);
      if (!offset.includes(':')) {
        if (/^[+\-]\d{2}$/.test(offset)) {
          normalized = `${normalized}:00`;
        } else if (/^[+\-]\d{2}\d{2}$/.test(offset)) {
          normalized = `${normalized.substring(0, signIndex + 3)}:${normalized.substring(signIndex + 3)}`;
        }
      }
    }
    return normalized;
  }

  function parseDate(dateTimeStr: string) {
    const date = new Date(normalizeDateTime(dateTimeStr));
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid datetime: ${dateTimeStr}`);
    }
    return date;
  }

  function formatTime(diff: number) {
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number): string => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId); 
  }, []);

  const getElapsedTimeSince = (dateTimeStr: string): string => {
    const initialDate = parseDate(dateTimeStr);
    const diff = currentTime.getTime() - initialDate.getTime();
    return formatTime(diff);
  };

  const getStaticValues = (dateTimeStr: string): { hours: number; minutes: number; seconds: number } => {
    const initialDate = parseDate(dateTimeStr);
    const diff = currentTime.getTime() - initialDate.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  };

  return {
    getElapsedTimeSince,
    getStaticValues
  };
}
