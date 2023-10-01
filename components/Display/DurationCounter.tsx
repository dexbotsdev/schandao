/* eslint-disable */
import React from 'react';
import { useState, useEffect } from "react";
import { formatDuration } from "../../utils/FormatNumber";

export function DurationCounter({ start }: { start: string }) {
    const [time, setTime] = useState(
      formatDuration(start, {
        startWith: 's',
        maxBlocks: 2,
      })
    );
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(
          formatDuration(start, {
            startWith: 's',
            maxBlocks: 2,
          })
        );
      }, 1000);
      return () => clearInterval(interval);
    }, [time]);
  
    return <>{time}</>;
  }