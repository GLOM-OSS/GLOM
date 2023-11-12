import { createContext } from 'react';
import { UserContextPayload } from './user.interface';

export const initialeState: UserContextPayload = {
  data: {
    active_year_id: '',
    email: '',
    first_name: '',
    gender: 'Male',
    last_name: '',
    national_id_number: '',
    person_id: '',
    phone_number: '',
    preferred_lang: 'en',
    roles: [],
    birthplace: null,
    nationality: '',
    longitude: null,
    latitude: null,
    image_ref: null,
    home_region: null,
    religion: null,
    handicap: '',
    created_at: '',
    civil_status: 'Married',
    employment_status: null,
    birthdate: new Date('1999/03/27').toISOString(),
  },
  userDispatch: () => null,
};
export default createContext<UserContextPayload>(initialeState);
