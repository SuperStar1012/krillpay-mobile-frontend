import { useState, useEffect } from 'react';
import moment from 'moment';

function pad(num) {
  return ('0' + num).slice(-2);
}
function formatTime(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  minutes = minutes % 60;
  // return `${pad(minutes)}:${pad(secs)}`;
  return pad(minutes) + ':' + pad(secs);
}

export function useConversionTimer(quote) {
  const [remaining, setRemaining] = useState('09:59');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let timer = null;
    async function startTimer() {
      timer = setTimeout(() => {
        if (quote?.created) {
          const CurrentDate = moment();
          const ExpiredDate = moment(quote.expires);
          const diff = ExpiredDate.diff(CurrentDate, 'seconds');
          const formatted = formatTime(diff);
          setRemaining(formatted);
          if (diff <= 0) {
            setExpired(true);
            return () => clearTimeout(timer);
          }
        }
        startTimer();
      }, 1000);
    }
    startTimer();
    return () => clearTimeout(timer);
  }, [quote]);
  return { remaining, expired };
}
