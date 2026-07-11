import { faker } from '@faker-js/faker';
import companyDataConfig from '../data/companyDataConfig.json';

faker.locale = 'en_ZA';

export function generateCompanyData(config = {}) {
  const {
    numCustomers = 150,
    numOrders = 300,
    numTickets = 100
  } = config;

  const customers = Array.from({ length: numCustomers }, (_, index) => {
    const region = faker.helpers.arrayElement(companyDataConfig.regions);
    return {
      customer_id: `C${String(index + 1).padStart(4, '0')}`,
      name: faker.person.fullName(),
      region,
      status: faker.helpers.arrayElement(companyDataConfig.customerStatuses),
      loyalty_points: faker.number.int({ min: 0, max: 6500 }),
      created_at: faker.date.past({ years: 2 }).toISOString().split('T')[0],
      tenure_months: faker.number.int({ min: 1, max: 72 }),
      email: faker.internet.email(),
      phone: faker.phone.number('+27 ## ### ####')
    };
  });

  const orders = Array.from({ length: numOrders }, (_, index) => {
    const customer = faker.helpers.arrayElement(customers);
    return {
      order_id: `O${String(index + 1).padStart(5, '0')}`,
      customer_id: customer.customer_id,
      order_date: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
      order_value: Number(faker.finance.amount({ min: 100, max: 9500, dec: 2 })),
      status: faker.helpers.arrayElement(companyDataConfig.orderStatuses),
      region: customer.region
    };
  });

  const support_tickets = Array.from({ length: numTickets }, (_, index) => {
    const customer = faker.helpers.arrayElement(customers);
    return {
      ticket_id: `T${String(index + 1).padStart(4, '0')}`,
      customer_id: customer.customer_id,
      created_at: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
      reason: faker.helpers.arrayElement(companyDataConfig.ticketReasons),
      resolved: faker.datatype.boolean() ? 'Yes' : 'No',
      resolution_hours: faker.number.int({ min: 1, max: 120 }),
      description: faker.lorem.sentence({ min: 8, max: 15 })
    };
  });

  return { customers, orders, support_tickets };
}

export function getOrGenerateData() {
  const cached = localStorage.getItem('companyData');
  if (cached) return JSON.parse(cached);

  const data = generateCompanyData();
  localStorage.setItem('companyData', JSON.stringify(data));
  return data;
}

export function clearCachedData() {
  localStorage.removeItem('companyData');
}
