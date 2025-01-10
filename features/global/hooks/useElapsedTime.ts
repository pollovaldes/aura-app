import { useState, useEffect } from 'react';

export function useElapsedTime(initialDateTime: string | null): string {
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

  function formatTime(diff: number): string {
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number): string => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  const [elapsedTime, setElapsedTime] = useState<string>(() => {
    if (!initialDateTime) {
      return "Sincronizando contador";
    }
    try {
      const initialDate = parseDate(initialDateTime);
      const now = new Date();
      const diff = now.getTime() - initialDate.getTime();
      return formatTime(diff);
    } catch (error) {
      console.error(error);
      return "Sincronizando contador";
    }
  });

  useEffect(() => {
    if (!initialDateTime) {
      setElapsedTime("Sincronizando contador");
      return;
    }

    let initialDate: Date;
    try {
      initialDate = parseDate(initialDateTime);
    } catch (error) {
      console.error(error);
      setElapsedTime("Sincronizando contador");
      return;
    }

    function updateElapsedTime() {
      const now = new Date();
      const diff = now.getTime() - initialDate.getTime();
      setElapsedTime(formatTime(diff));
    }

    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  }, [initialDateTime]);

  return elapsedTime;
}
