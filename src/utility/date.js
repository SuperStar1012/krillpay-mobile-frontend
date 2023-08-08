const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const date = {
  getDateFromMilliseconds: milliSeconds => {
    let date = new Date(milliSeconds);
    return date.getDate() + ' ' + months[date.getMonth()];
  },
};
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const WEEK4 = 4 * WEEK;
const MONTH = 31 * DAY;
const YEAR = Math.floor(365 * DAY);

export const TIMES = {
  second: SECOND,
  minute: MINUTE,
  day: DAY,
  hour: HOUR,
  week: WEEK,
  week4: WEEK4,
  month: MONTH,
  year: YEAR,
};

export default date;
