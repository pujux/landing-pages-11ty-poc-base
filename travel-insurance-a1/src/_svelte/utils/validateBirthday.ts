import {differenceInYears, parse} from "date-fns";

export interface ValidateDateOfBirth {
  valid: boolean,
  error?: 'empty' | 'format-invalid' | 'age-too-low' | 'age-too-high' | 'too-many-adults' | 'too-many-children'
}

interface Config {
  mainInsuredMinAge?: number;
  adultMaxAge?: number;
  childMaxAge?: number;
  maxAdditionalAdults?: number;
  maxAdditionalChildren?: number;
}

export const validateDateOfBirth = (dateOfBirth: string, config: Config | false, additionalPeople): ValidateDateOfBirth => {
  if (!dateOfBirth) {
    return {
      valid: false,
      error: 'empty'
    };
  }
  const date = parse(dateOfBirth, 'dd.MM.yyyy', new Date());
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'format-invalid'
    };
  } else {
    const today = new Date();
    const age = differenceInYears(today, parse(dateOfBirth, 'dd.MM.yyyy', new Date()));

    // if we're also checking for age restrictions
    if (config?.mainInsuredMinAge && (age < config.mainInsuredMinAge)) {
      return {
        valid: false,
        error: 'age-too-low'
      }
    } else if ((config?.adultMaxAge !== false ) && (age >= config.adultMaxAge)) {
      return {
        valid: false,
        error: 'age-too-high'
      }
    }

    // also check against the configured limits of already saved additional people, for usage in the birthday field when adding a new additional person
    if (additionalPeople) {

      let children = 0;
      let adults = 0;

      // count all children and adults
      additionalPeople.forEach( person => {
        if (person.type === 'Child') {
          children++;
        } else if (person.type === 'Adult') {
          adults++;
        }
      });

      // if the person entered is also a child, check if all spots for children are already filled
      if ( (age < config.childMaxAge) && (children === config.maxAdditionalChildren) ) {
        return {
          valid: false,
          error: 'too-many-children'
        }

      // if the person entered is also an adult, check if all spots for adults are already filled
      } else if( (age >= config.childMaxAge) && (adults === config.maxAdditionalAdults) ) {
        return {
          valid: false,
          error: 'too-many-adults'
        }
      }
    }

    return {
      valid: true
    };
  }
}
