import procRows from './procRows';

const todayData = (dataArray, date) => {
  if (!dataArray) { return [] }
 
  const today = dataArray.filter(appt => {
    let ret = sameDay(appt.start, date); 
    let ret1 = sameDay(appt.end, date);
    console.log('ret || ret1', ret, ret1)
    return ret || ret1;
  });
  return procRows(today);
}

const sameDay = (d1, d2) => {
  return d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() && 
  d1.getFullYear() === d2.getFullYear();
}

export default todayData;
