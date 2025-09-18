
import { useState, useEffect } from 'react';

export const useEventSource = (url: string | null) => {
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsOpen(true);
      console.log('EventSource Connected');
    };

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData((prevData) => [newData, ...prevData]); // Prepend new data
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      setIsOpen(false);
    };

    return () => {
      eventSource.close();
      setIsOpen(false);
    };
  }, [url]);

  return { data, isOpen };
};
