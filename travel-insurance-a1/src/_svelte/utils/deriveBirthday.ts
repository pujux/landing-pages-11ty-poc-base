import {getYear, parse, format} from "date-fns";

export const deriveBirthday = (value) => {
  const day = value.substring(0,2);
  const month = value.substring(2,4);
  const year = parseInt(value.substring(4,7));

  // yes this is nasty. There is no other way around this.
  let yearFormatted = 1000 + year;
  if (year < 99) {
    yearFormatted += 1000;
  }

  return parse(`${day}-${month}-${yearFormatted}`, 'dd-MM-yyyy', new Date());
};
