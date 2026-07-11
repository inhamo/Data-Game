import json
import random
import os
from faker import Faker

fake = Faker('en_ZA')  # South African locale for realistic names, cities, etc.

# ---------- Configuration ----------
NUM_CUSTOMERS = 150
NUM_ORDERS = 300
NUM_TICKETS = 100

REGIONS = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo']
STATUSES = ['Active', 'Churned', 'Suspended', 'Pending']
ORDER_STATUSES = ['Completed', 'Returned', 'Pending', 'Cancelled']
TICKET_REASONS = ['Missing points', 'Delivery delay', 'Damaged product', 'Wrong item', 'Billing issue', 'Other']

# ---------- Generate Customers ----------
customers = []
for i in range(1, NUM_CUSTOMERS + 1):
    region = random.choice(REGIONS)
    customers.append({
        'customer_id': f'C{i:04d}',
        'name': fake.name(),
        'region': region,
        'status': random.choice(STATUSES),
        'loyalty_points': random.randint(0, 6000),
        'created_at': fake.date_between(start_date='-2y', end_date='-1y').isoformat(),
        'tenure_months': random.randint(1, 72)
    })

# ---------- Generate Orders ----------
orders = []
for i in range(1, NUM_ORDERS + 1):
    customer = random.choice(customers)
    orders.append({
        'order_id': f'O{i:05d}',
        'customer_id': customer['customer_id'],
        'order_date': fake.date_between(start_date='-6m', end_date='today').isoformat(),
        'order_value': round(random.uniform(100, 9000), 2),
        'status': random.choice(ORDER_STATUSES),
        'region': customer['region']  # usually matches customer region
    })

# ---------- Generate Support Tickets ----------
tickets = []
for i in range(1, NUM_TICKETS + 1):
    customer = random.choice(customers)
    tickets.append({
        'ticket_id': f'T{i:04d}',
        'customer_id': customer['customer_id'],
        'created_at': fake.date_between(start_date='-6m', end_date='today').isoformat(),
        'reason': random.choice(TICKET_REASONS),
        'resolved': random.choice(['Yes', 'No']),
        'resolution_hours': random.randint(1, 120)
    })

# ---------- Export to JSON (for frontend) ----------
tables = {
    'customers': customers,
    'orders': orders,
    'support_tickets': tickets
}

# Ensure the public/data folder exists
os.makedirs('public/data', exist_ok=True)

with open('public/data/tables.json', 'w') as f:
    json.dump(tables, f, indent=2)

print(f"Data written to public/data/tables.json")
print(f"   Customers: {len(customers)}")
print(f"   Orders:    {len(orders)}")
print(f"   Tickets:   {len(tickets)}")

# Optional: also export as CSV for external use
import csv

def write_csv(filename, headers, rows):
    with open(f'public/data/{filename}', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

write_csv('customers.csv', customers[0].keys(), customers)
write_csv('orders.csv', orders[0].keys(), orders)
write_csv('support_tickets.csv', tickets[0].keys(), tickets)

print("📄 CSV files also saved in public/data/")