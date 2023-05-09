import {format, parse} from "date-fns";

export const formatBirthday = string => {
  const parsedDate = new Date(string);
  const day = format(parsedDate, 'dd');
  const month = format(parsedDate, 'MM');;
  const year = format(parsedDate, 'yyyy');

  const newDateString = parse(`${day}-${month}-${year}`, 'dd-mm-yyyy', new Date());
  const formattedDate = format(newDateString, 'yyyy-mm-dd');

  return formattedDate;
}
