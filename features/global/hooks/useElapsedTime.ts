import { useState, useEffect } from 'react';

export function useElapsedTime(initialDateTime: string): string {
  function normalizeDateTime(dateTimeStr: string): string {
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

  function parseDate(dateTimeStr: string): Date {
    const date = new Date(normalizeDateTime(dateTimeStr));
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid datetime: ${dateTimeStr}`);
    }
    return date;
  }

  const [elapsedTime, setElapsedTime] = useState<string>(() => {
    const initialDate = parseDate(initialDateTime);
    const now = new Date();
    const diff = now.getTime() - initialDate.getTime();
    return formatTime(diff);
  });

  useEffect(() => {
    const initialDate = parseDate(initialDateTime);

    function updateElapsedTime() {
      const now = new Date();
      const diff = now.getTime() - initialDate.getTime();
      setElapsedTime(formatTime(diff));
    }

    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  }, [initialDateTime]);

  function formatTime(diff: number): string {
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    function pad(num: number): string {
      return num.toString().padStart(2, '0');
    }

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return elapsedTime;
}
