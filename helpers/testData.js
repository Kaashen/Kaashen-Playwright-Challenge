import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const users    = require('../test-data/users.json');
const bookings = require('../test-data/bookings.json');
const auth     = require('../test-data/auth.json');

export { users, bookings, auth };