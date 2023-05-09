import {writable} from "svelte/store";

export interface AdditionalPersonFormData {
    firstName: string;
    lastName: string;
    salutation: string;
    nationalIdentificationNumber: string;
    dateOfBirth: Date | string;
    passportnumber?: string;
}

export interface AdditionalPerson {
  id: string;
  name: string;
  type: 'adult' | 'child';
  age: number;
  birthDate: Date | string;
  saved: boolean;
  formData: AdditionalPersonFormData;
}

export const additionalPeopleStore = writable([]);

export const storeAdditionalPerson = (person: AdditionalPerson) => {
  additionalPeopleStore.update(people => [...people, person]);
};

export const updateAdditionalPerson = (person: AdditionalPerson) => {
  additionalPeopleStore.update(people => {
    const index = people.findIndex(p => p.id === person.id);
    people[index] = person;

    return people;
  });
};

export const removeAdditionalPerson = (person: AdditionalPerson) => {
  additionalPeopleStore.update(people => {
    const index = people.findIndex(p => p.id === person.id);
    people.splice(index, 1);

    return people;
  });
};

export const clearAdditionalPeople = () => {
  additionalPeopleStore.set([]);
};
