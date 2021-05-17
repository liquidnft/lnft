import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subDays,
  subSeconds,
  subMinutes,
  subHours,
} from "date-fns";

export default (d) => {
  let now = new Date();
  if (differenceInSeconds(d, now) <= 1) return;

  let days = differenceInDays(d, now);
  d = subDays(d, days);
  let hours = differenceInHours(d, now);
  d = subHours(d, hours);
  let minutes = differenceInMinutes(d, now);
  d = subMinutes(d, minutes);
  let seconds = differenceInSeconds(d, now);

  minutes = ("0" + minutes).slice(-2);
  seconds = ("0" + seconds).slice(-2);

  return days > 1
    ? `
  ${days ? days + (days === 1 ? " day" : " days") : ""} 
  ${hours ? hours + (hours === 1 ? " hour" : " hours") : ""} 
  `
    : hours > 1
    ? `
  ${hours ? hours + (hours === 1 ? " hour" : " hours") : ""} 
  ${minutes ? minutes + (minutes === 1 ? " minute" : " minutes") : ""}
  `
    : `
  ${minutes ? minutes + (minutes === 1 ? " minute" : " minutes") : ""}
  ${seconds ? seconds + (seconds === 1 ? " second" : " seconds") : ""}
  `;
};
