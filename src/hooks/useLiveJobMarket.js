import { useState, useEffect, useMemo } from 'react';
import { jobs } from '../data';
import { relativeTime } from '../utils';

export function useLiveJobMarket() {
  const [marketStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(
    () =>
      jobs
        .filter((job) => now - marketStart >= job.revealAfter)
        .map((job) => {
          const activeFor = Math.max(0, now - marketStart - job.revealAfter);
          const postedAt = marketStart + job.revealAfter - job.postedMinutes * 60000;
          return {
            ...job,
            posted: relativeTime(postedAt, now),
            applicants: job.applicants + Math.floor(activeFor / job.applicantInterval),
            isNew: now - (marketStart + job.revealAfter) < 60000 && job.revealAfter > 0,
          };
        }),
    [marketStart, now]
  );
}