export const users = {
  valid:   { username: 'standard_user',   password: 'secret_sauce' },
  locked:  { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user',    password: 'secret_sauce' },
  invalid: { username: 'fake_user',       password: 'wrong_password' },
};

export const bookings = {
  create: {
    firstname: 'James', lastname: 'Brown',
    totalprice: 250, depositpaid: true,
    bookingdates: { checkin: '2026-08-01', checkout: '2026-08-07' },
    additionalneeds: 'Breakfast',
  },
  update: {
    firstname: 'Sarah', lastname: 'Connor',
    totalprice: 400, depositpaid: false,
    bookingdates: { checkin: '2026-09-10', checkout: '2026-09-15' },
    additionalneeds: 'Late checkout',
  },
  partialUpdate: { firstname: 'Updated', lastname: 'Name' },
};

export const auth = {
  username: 'admin',
  password: 'password123',
};

export function maskDynamic(obj, fields = ['bookingid']) {
  const copy = JSON.parse(JSON.stringify(obj));
  fields.forEach(f => {
    if (f in copy) copy[f] = '[dynamic]';
    if (copy.booking && f in copy.booking) copy.booking[f] = '[dynamic]';
  });
  return copy;
}