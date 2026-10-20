/**
 * Demo credential rules and a fake "leaked combo list" used to simulate
 * credential stuffing on the login page. Safe to import in client code.
 */

export type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};

/** Any email is accepted; passwords need at least this many characters. */
export const MIN_PASSWORD_LENGTH = 10;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fictitious accounts behind the leaked emails, used to seed their profiles. */
export const DEMO_USERS: Profile[] = [
  {
    email: 'jon@gmail.com',
    firstName: 'Jon',
    lastName: 'Smith',
    phone: '+49 30 12345678',
    address: 'Demostraße 123',
    city: 'Berlin',
    zip: '10115',
    country: 'Germany',
  },
  {
    email: 'sarah.miller84@gmail.com',
    firstName: 'Sarah',
    lastName: 'Miller',
    phone: '+1 312 555 0184',
    address: '2210 N Clark St',
    city: 'Chicago',
    zip: '60614',
    country: 'United States',
  },
  {
    email: 'mike.thompson@yahoo.com',
    firstName: 'Mike',
    lastName: 'Thompson',
    phone: '+1 512 555 0139',
    address: '804 Congress Ave',
    city: 'Austin',
    zip: '78701',
    country: 'United States',
  },
  {
    email: 'jessica.lee@outlook.com',
    firstName: 'Jessica',
    lastName: 'Lee',
    phone: '+1 206 555 0172',
    address: '1511 3rd Ave',
    city: 'Seattle',
    zip: '98101',
    country: 'United States',
  },
  {
    email: 'dkowalski@hotmail.com',
    firstName: 'Dawid',
    lastName: 'Kowalski',
    phone: '+48 22 555 0147',
    address: 'ul. Marszałkowska 84',
    city: 'Warsaw',
    zip: '00-514',
    country: 'Poland',
  },
  {
    email: 'anna.schmidt@gmx.de',
    firstName: 'Anna',
    lastName: 'Schmidt',
    phone: '+49 89 5550 2231',
    address: 'Leopoldstraße 41',
    city: 'Munich',
    zip: '80802',
    country: 'Germany',
  },
  {
    email: 'lucas.martin@orange.fr',
    firstName: 'Lucas',
    lastName: 'Martin',
    phone: '+33 1 55 50 12 34',
    address: '18 Rue de Rivoli',
    city: 'Paris',
    zip: '75004',
    country: 'France',
  },
  {
    email: 'emma.rossi@libero.it',
    firstName: 'Emma',
    lastName: 'Rossi',
    phone: '+39 02 5550 1823',
    address: 'Via Torino 22',
    city: 'Milan',
    zip: '20123',
    country: 'Italy',
  },
  {
    email: 'chris_brown77@gmail.com',
    firstName: 'Chris',
    lastName: 'Brown',
    phone: '+1 404 555 0177',
    address: '350 Peachtree St NE',
    city: 'Atlanta',
    zip: '30308',
    country: 'United States',
  },
  {
    email: 'olivia.wilson@icloud.com',
    firstName: 'Olivia',
    lastName: 'Wilson',
    phone: '+1 415 555 0126',
    address: '742 Valencia St',
    city: 'San Francisco',
    zip: '94110',
    country: 'United States',
  },
  {
    email: 'tom.becker@web.de',
    firstName: 'Tom',
    lastName: 'Becker',
    phone: '+49 221 5550 418',
    address: 'Ehrenstraße 12',
    city: 'Cologne',
    zip: '50672',
    country: 'Germany',
  },
  {
    email: 'laura.garcia@yahoo.es',
    firstName: 'Laura',
    lastName: 'García',
    phone: '+34 91 555 0193',
    address: 'Calle de Alcalá 98',
    city: 'Madrid',
    zip: '28009',
    country: 'Spain',
  },
  {
    email: 'kevin.nguyen@gmail.com',
    firstName: 'Kevin',
    lastName: 'Nguyen',
    phone: '+1 714 555 0158',
    address: '9200 Bolsa Ave',
    city: 'Westminster',
    zip: '92683',
    country: 'United States',
  },
  {
    email: 'sophie.dubois@free.fr',
    firstName: 'Sophie',
    lastName: 'Dubois',
    phone: '+33 4 55 50 27 81',
    address: '7 Rue de la République',
    city: 'Lyon',
    zip: '69002',
    country: 'France',
  },
  {
    email: 'ryan.oconnor@outlook.com',
    firstName: 'Ryan',
    lastName: "O'Connor",
    phone: '+353 1 555 0164',
    address: '22 Camden St Lower',
    city: 'Dublin',
    zip: 'D02 XE80',
    country: 'Ireland',
  },
  {
    email: 'mia.jansen@ziggo.nl',
    firstName: 'Mia',
    lastName: 'Jansen',
    phone: '+31 20 555 0137',
    address: 'Prinsengracht 263',
    city: 'Amsterdam',
    zip: '1016 GV',
    country: 'Netherlands',
  },
  {
    email: 'alex.petrov@mail.ru',
    firstName: 'Alexei',
    lastName: 'Petrov',
    phone: '+372 5550 1942',
    address: 'Narva mnt 7',
    city: 'Tallinn',
    zip: '10117',
    country: 'Estonia',
  },
  {
    email: 'nina.andersson@hotmail.se',
    firstName: 'Nina',
    lastName: 'Andersson',
    phone: '+46 8 555 012 45',
    address: 'Götgatan 48',
    city: 'Stockholm',
    zip: '118 26',
    country: 'Sweden',
  },
  {
    email: 'paul.wright@btinternet.com',
    firstName: 'Paul',
    lastName: 'Wright',
    phone: '+44 20 7946 0518',
    address: '14 Camden High St',
    city: 'London',
    zip: 'NW1 0JH',
    country: 'United Kingdom',
  },
  {
    email: 'hannah.fischer@t-online.de',
    firstName: 'Hannah',
    lastName: 'Fischer',
    phone: '+49 40 5550 7712',
    address: 'Eppendorfer Weg 95',
    city: 'Hamburg',
    zip: '20259',
    country: 'Germany',
  },
  {
    email: 'daniel.kim@proton.me',
    firstName: 'Daniel',
    lastName: 'Kim',
    phone: '+41 44 555 01 88',
    address: 'Langstrasse 120',
    city: 'Zurich',
    zip: '8004',
    country: 'Switzerland',
  },
  {
    email: 'chloe.bernard@gmail.com',
    firstName: 'Chloé',
    lastName: 'Bernard',
    phone: '+33 5 55 50 64 19',
    address: "3 Cours de l'Intendance",
    city: 'Bordeaux',
    zip: '33000',
    country: 'France',
  },
  {
    email: 'marco.bianchi@virgilio.it',
    firstName: 'Marco',
    lastName: 'Bianchi',
    phone: '+39 06 5550 3471',
    address: 'Via del Corso 156',
    city: 'Rome',
    zip: '00186',
    country: 'Italy',
  },
  {
    email: 'lisa.mueller@gmx.net',
    firstName: 'Lisa',
    lastName: 'Müller',
    phone: '+43 1 555 0291',
    address: 'Mariahilfer Straße 77',
    city: 'Vienna',
    zip: '1060',
    country: 'Austria',
  },
  {
    email: 'james.carter@aol.com',
    firstName: 'James',
    lastName: 'Carter',
    phone: '+1 617 555 0145',
    address: '88 Beacon St',
    city: 'Boston',
    zip: '02108',
    country: 'United States',
  },
  {
    email: 'eva.novak@seznam.cz',
    firstName: 'Eva',
    lastName: 'Nováková',
    phone: '+420 2 5550 1836',
    address: 'Vinohradská 54',
    city: 'Prague',
    zip: '120 00',
    country: 'Czech Republic',
  },
  {
    email: 'ben.harris@yahoo.co.uk',
    firstName: 'Ben',
    lastName: 'Harris',
    phone: '+44 161 496 0723',
    address: '41 Deansgate',
    city: 'Manchester',
    zip: 'M3 2BW',
    country: 'United Kingdom',
  },
  {
    email: 'julia.santos@uol.com.br',
    firstName: 'Júlia',
    lastName: 'Santos',
    phone: '+55 11 5550 2847',
    address: 'Rua Augusta 1508',
    city: 'São Paulo',
    zip: '01304-001',
    country: 'Brazil',
  },
  {
    email: 'max.weber@posteo.de',
    firstName: 'Max',
    lastName: 'Weber',
    phone: '+49 711 5550 384',
    address: 'Königstraße 28',
    city: 'Stuttgart',
    zip: '70173',
    country: 'Germany',
  },
  {
    email: 'grace.taylor@icloud.com',
    firstName: 'Grace',
    lastName: 'Taylor',
    phone: '+61 2 5550 1297',
    address: '120 Crown St',
    city: 'Sydney',
    zip: '2010',
    country: 'Australia',
  },
];

/** Common leaked passwords; all shorter than 7 characters, so always invalid. */
const LEAKED_PASSWORDS = [
  '123456',
  '12345',
  'qwerty',
  'abc123',
  '111111',
  'pass1',
  'letmei',
  'dragon',
  'monkey',
  'iloveu',
  'sunny1',
  'hallo',
  'admin',
  '654321',
  'azerty',
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** A random email/password pair, as a credential stuffing bot would replay. */
export function randomLeakedCredentials() {
  return {email: pick(DEMO_USERS).email, password: pick(LEAKED_PASSWORDS)};
}

/** Lowercase ASCII letters only, e.g. "Nováková" → "novakova". */
function slug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

/** A plausible new address (e.g. "emma.weber42@gmx.de") for the signup form. */
export function randomSignupEmail() {
  const first = slug(pick(DEMO_USERS).firstName);
  const last = slug(pick(DEMO_USERS).lastName);
  const domain = pick(DEMO_USERS).email.split('@')[1];
  const number = 10 + Math.floor(Math.random() * 90);
  return `${first}.${last}${number}@${domain}`;
}
