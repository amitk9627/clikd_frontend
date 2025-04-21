// ******************************************
export const estimatedTimeConvertor = (fractionalTime) => {
  const totalHours = fractionalTime * 24;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  return formattedTime;
};

// ****************************************
export function getCurrentDate() {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  let currDate = `${year}-${month}-${day}`;
  return currDate;
}

// ****************************************
export function findDay(day) {
  switch (day) {
    case '0':
      return 'Sun, ';
    case '1':
      return 'Mo, ';
    case '2':
      return 'Tu, ';
    case '3':
      return 'We, ';
    case '4':
      return 'Th, ';
    case '5':
      return 'Fr, ';
    case '6':
      return 'Sat, ';
    default:
      return 'Not Yet';
  }
}

// *********** trip management Add Time
export const addTwoTime = (time1, time2) => {
  console.log(time1, time2);
  const date1 = new Date(`1970-01-01T${time1}Z`);
  const date2 = new Date(`1970-01-01T${time2}Z`);

  const sumMilliseconds = date1.getTime() + date2.getTime();
  const sumDate = new Date(sumMilliseconds);

  const formattedResult = sumDate.toISOString().substr(11, 8);

  return formattedResult;
};

// *********** trip management Diff Time
export function diffTwoTime(startTime, endTime) {
  // Parse start and end times

  const startParts = startTime.split(':').map(Number);
  const endParts = endTime.split(':').map(Number);

  // Convert start and end times to milliseconds
  const startMs = startParts[0] * 3600000 + startParts[1] * 60000 + startParts[2] * 1000;
  const endMs = endParts[0] * 3600000 + endParts[1] * 60000 + endParts[2] * 1000;

  // Calculate the difference in milliseconds
  let difference = Math.abs(endMs - startMs);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(difference / 3600000);
  difference %= 3600000;
  const minutes = Math.floor(difference / 60000);
  difference %= 60000;
  const seconds = Math.floor(difference / 1000);

  // Format the result
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  //

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// ********************* compare two time
export function compareTwoTime(startTime, endTime) {
  // Parse start and end times
  const startParts = startTime.split(':').map(Number);
  const endParts = endTime.split(':').map(Number);
  const startMs = startParts[0] * 3600000 + startParts[1] * 60000 + startParts[2] * 1000;
  const endMs = endParts[0] * 3600000 + endParts[1] * 60000 + endParts[2] * 1000;
  if (startMs - endMs > 0) {
    return true;
  }
  return false;
}
