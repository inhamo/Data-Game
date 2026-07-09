import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("public", "data", "loyalty-project");
fs.mkdirSync(outDir, { recursive: true });

let seed = 20260803;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
function pick(values) {
  return values[Math.floor(random() * values.length)];
}
function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function writeCsv(name, headers, rows) {
  const output = [headers.join(","), ...rows.map((row) => row.map(csv).join(","))].join("\n");
  fs.writeFileSync(path.join(outDir, name), output);
}

const regions = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo"];
const channels = ["Organic", "Paid Search", "Email", "Social", "Referral"];
const customers = [];
for (let i = 1; i <= 12000; i += 1) {
  const migrated = i <= 3600;
  const tenure = 3 + Math.floor(random() * 57);
  const balanceError = migrated && random() < 0.31;
  customers.push([
    `C${String(i).padStart(6, "0")}`,
    `202${Math.floor(random() * 5)}-${String(1 + Math.floor(random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(random() * 27)).padStart(2, "0")}`,
    pick(regions),
    pick(channels),
    tenure,
    migrated ? "MIG-2025-11" : "NATIVE",
    Math.floor(random() * 7200),
    balanceError ? Math.floor(80 + random() * 1600) : 0,
    balanceError && random() < 0.62 ? "Churned" : random() < 0.12 ? "Churned" : "Active"
  ]);
}
writeCsv("customers.csv", ["customer_id", "join_date", "region", "acquisition_channel", "tenure_months", "loyalty_source", "points_balance", "points_variance", "customer_status"], customers);

const orders = [];
for (let i = 1; i <= 50000; i += 1) {
  const customerIndex = Math.floor(random() * customers.length);
  const customer = customers[customerIndex];
  const migrated = customer[5] === "MIG-2025-11";
  const redemption = random() < (migrated ? 0.28 : 0.16);
  const timeout = redemption && migrated && random() < 0.19;
  orders.push([
    `O${String(i).padStart(7, "0")}`,
    customer[0],
    `2026-${String(1 + Math.floor(random() * 7)).padStart(2, "0")}-${String(1 + Math.floor(random() * 27)).padStart(2, "0")}`,
    pick(["Electronics", "Home", "Beauty", "Fashion", "Grocery"]),
    (180 + random() * 4200).toFixed(2),
    redemption ? Math.floor(100 + random() * 1800) : 0,
    timeout ? "Failed" : pick(["Delivered", "Delivered", "Delivered", "Returned"]),
    timeout ? "loyalty_redemption_timeout" : ""
  ]);
}
writeCsv("orders.csv", ["order_id", "customer_id", "order_date", "category", "order_value_zar", "points_redeemed", "order_status", "checkout_error"], orders);

const tickets = [];
for (let i = 1; i <= 15000; i += 1) {
  const customerIndex = Math.floor(random() * customers.length);
  const customer = customers[customerIndex];
  const migrated = customer[5] === "MIG-2025-11";
  const loyaltyIssue = migrated && random() < 0.48;
  const issue = loyaltyIssue ? pick(["Missing loyalty points", "Redemption failed", "Incorrect points balance"]) : pick(["Late delivery", "Damaged item", "Refund delay", "Account access"]);
  tickets.push([
    `T${String(i).padStart(7, "0")}`,
    customer[0],
    `2026-${String(1 + Math.floor(random() * 7)).padStart(2, "0")}-${String(1 + Math.floor(random() * 27)).padStart(2, "0")}`,
    issue,
    pick(["Chat", "Email", "Phone"]),
    Math.floor(2 + random() * (loyaltyIssue ? 92 : 46)),
    random() < (loyaltyIssue ? 0.29 : 0.11) ? "Reopened" : "Resolved",
    Math.floor(1 + random() * 5)
  ]);
}
writeCsv("support_tickets.csv", ["ticket_id", "customer_id", "created_date", "issue_type", "contact_channel", "resolution_hours", "ticket_status", "satisfaction_score"], tickets);

fs.writeFileSync(path.join(outDir, "README.txt"), `SOLSTICE RETAIL GROUP - CUSTOMER LOYALTY PROJECT

Files:
- customers.csv: 12,000 customer records
- orders.csv: 50,000 order records
- support_tickets.csv: 15,000 support interactions

Join key: customer_id
Analysis period: January-July 2026

Your task:
Use Python to clean, join, and investigate the data. Build an executive Power BI report explaining which customers are leaving, what changed, and what Solstice should do next.
`);

console.log("Generated 77,000 project rows.");
