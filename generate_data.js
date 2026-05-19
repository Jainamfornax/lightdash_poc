const fs = require('fs');

let seedVal = 77;
function rand() { seedVal = (seedVal * 16807) % 2147483647; return (seedVal - 1) / 2147483646; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function wPick(items, weights) {
  const t = weights.reduce((a, b) => a + b, 0);
  let r = rand() * t;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

const products = [
  { id: 'P001', name: 'Whey Isolate - Choc', cat: 'Powder', price: 45, cogs: 18, w: 20 },
  { id: 'P002', name: 'Dark Choc Protein Butter', cat: 'Butter', price: 28, cogs: 21, w: 10 },
  { id: 'P003', name: 'Himalayan Salt Chips', cat: 'Chips', price: 12, cogs: 8, w: 18 },
  { id: 'P004', name: 'Daily Plant Protein', cat: 'Powder', price: 52, cogs: 20, w: 12 },
  { id: 'P005', name: 'Almond Crunch Bars', cat: 'Bars', price: 24, cogs: 11, w: 14 },
  { id: 'P006', name: 'Trial Discovery Kit', cat: 'Kits', price: 65, cogs: 22, w: 8 },
  { id: 'P007', name: 'Smooth Peanut Butter', cat: 'Butter', price: 35, cogs: 21, w: 12 },
  { id: 'P008', name: 'Collagen Peptides - Berry', cat: 'Powder', price: 58, cogs: 23, w: 7 },
  { id: 'P009', name: 'Mango Protein Smoothie', cat: 'Drinks', price: 18, cogs: 9, w: 10 },
  { id: 'P010', name: 'Mega Combo Box', cat: 'Kits', price: 89, cogs: 35, w: 4 },
];
const pw = products.map(p => p.w);

const startDate = new Date(2025, 0, 1);
const endDate = new Date(2026, 3, 30);
const totalDays = Math.round((endDate - startDate) / 86400000);

function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function addD(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function daysBtw(a, b) { return Math.round((b - a) / 86400000); }
function monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

function getCampaign(date, isFirst) {
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 11 && d >= 20) || (m === 12 && d <= 5)) return 'black_friday';
  if (m === 10 && d >= 5 && d <= 15) return 'big_billion_days';
  if (m === 7 && d >= 10 && d <= 20) return 'prime_day';
  if ((m === 3 && d >= 10) || (m === 4 && d <= 10)) return 'easter_special';
  if (isFirst && rand() < 0.55) return 'first_time_customer';
  return 'organic';
}

function getDiscount(campaign) {
  const map = {
    black_friday: [[15, 20, 25], [40, 40, 20]],
    big_billion_days: [[12, 18, 22], [35, 40, 25]],
    prime_day: [[10, 15, 20], [30, 45, 25]],
    easter_special: [[8, 10, 12], [30, 50, 20]],
    first_time_customer: [[5, 10, 0], [40, 35, 25]],
    organic: [[0, 0, 5], [75, 15, 10]],
  };
  const [vals, wts] = map[campaign] || [[0], [1]];
  return wPick(vals, wts);
}

function getSource(campaign, is2026) {
  if (is2026) {
    if (['black_friday', 'big_billion_days', 'prime_day'].includes(campaign))
      return wPick(['organic', 'paid_search', 'paid_social'], [40, 32, 28]);
    if (campaign === 'first_time_customer')
      return wPick(['organic', 'paid_search', 'paid_social'], [35, 35, 30]);
    return wPick(['organic', 'paid_search', 'paid_social'], [68, 18, 14]);
  }
  if (['black_friday', 'big_billion_days', 'prime_day'].includes(campaign))
    return wPick(['organic', 'paid_search', 'paid_social'], [15, 42, 43]);
  if (campaign === 'first_time_customer')
    return wPick(['organic', 'paid_search', 'paid_social'], [12, 45, 43]);
  return wPick(['organic', 'paid_search', 'paid_social'], [42, 30, 28]);
}

function getAdSpend(campaign, source, is2026) {
  if (source === 'organic') return 0;
  const mult = is2026 ? 0.45 : 1.0;
  const ranges = {
    black_friday: [22, 55], big_billion_days: [25, 58], prime_day: [18, 48],
    easter_special: [15, 42], first_time_customer: [20, 48], organic: [0, 12],
  };
  const [lo, hi] = ranges[campaign] || [0, 0];
  return Math.round(randInt(lo, hi) * mult);
}

function getPayment(isFirst, orderDate) {
  const monthsFromStart = (orderDate.getFullYear() - 2025) * 12 + orderDate.getMonth();
  const codPctFirst = Math.max(15, 55 - monthsFromStart * 2.5);
  const codPctReturn = Math.max(8, 38 - monthsFromStart * 2);
  const codPct = isFirst ? codPctFirst : codPctReturn;
  return rand() * 100 < codPct ? 'COD' : 'Online';
}

function seasonMult(date) {
  const m = date.getMonth() + 1, d = date.getDate(), dow = date.getDay();
  const y = date.getFullYear();
  const yearBoost = (y === 2026) ? 1.2 : 1.0;
  let base = 1.0;
  if ((m === 11 && d >= 20) || (m === 12 && d <= 5)) base = 3.5;
  else if (m === 10 && d >= 5 && d <= 15) base = 3.2;
  else if (m === 7 && d >= 10 && d <= 20) base = 2.8; // Prime Day spike bigger
  else if ((m === 3 && d >= 10) || (m === 4 && d <= 10)) base = 2.2;
  else if (m === 1) base = 1.4;
  else if (dow === 0 || dow === 6) base = 1.25;
  return base * yearBoost;
}

// ─── CUSTOMER POOL ───────────────────────────────────
// New customers acquired per month with natural variance
// Prime Day (Jul 2025) has a big spike in new customer acquisition
const monthlyNewCustomers = {
  '2025-01': 22, '2025-02': 20, '2025-03': 18, '2025-04': 16,
  '2025-05': 14, '2025-06': 14, '2025-07': 30, // ← Prime Day spike!
  '2025-08': 14, '2025-09': 12, '2025-10': 20, // Big Billion Days
  '2025-11': 22, // Black Friday
  '2025-12': 10,
  '2026-01': 16, '2026-02': 14, '2026-03': 15, '2026-04': 8,
};

const custs = [];
let custIdx = 0;
Object.entries(monthlyNewCustomers).forEach(([mk, count]) => {
  const [yr, mo] = mk.split('-').map(Number);
  for (let i = 0; i < count; i++) {
    custIdx++;
    const day = randInt(1, 28);
    const firstDate = new Date(yr, mo - 1, day);
    // Churn tiers: some customers never come back, some become loyal
    const tier = wPick(['one_time', 'occasional', 'regular', 'vip'], [32, 28, 26, 14]);
    const maxOrders = tier === 'vip' ? randInt(7, 14) : tier === 'regular' ? randInt(3, 6) : tier === 'occasional' ? randInt(2, 3) : 1;
    const ltv = tier === 'vip' ? randInt(420, 680) : tier === 'regular' ? randInt(260, 460) : tier === 'occasional' ? randInt(130, 290) : randInt(55, 160);
    // Churn probability: one_timers always churn, others have a chance
    // Regulars/VIPs have a "repurchase gap" — they come back within X days
    const repurchaseGapDays = tier === 'vip' ? randInt(15, 30) : tier === 'regular' ? randInt(25, 50) : tier === 'occasional' ? randInt(45, 75) : 999;
    custs.push({
      id: `C${String(custIdx).padStart(4, '0')}`,
      firstDate, tier, maxOrders, ltv, orders: 0,
      lastOrderDate: null,
      repurchaseGapDays,
      prefCh: wPick(['Amazon', 'Shopify'], [58, 42]),
      prefDev: wPick(['mobile', 'desktop', 'tablet'], [52, 35, 13]),
      cohort: mk,
    });
  }
});

console.log(`Total customers in pool: ${custs.length}`);

// ─── MONTHLY ORDER TARGETS ───────────────────────────
// Explicit control over how many orders each month gets.
// Story: steady growth in 2025, 2026 YTD ~35% above PY YTD.
// PY YTD (Jan-Apr 2025): ~90 orders at ~$165 AOV = ~$14,850
// CY YTD (Jan-Apr 2026): ~120 orders at ~$150 AOV = ~$18,000 (+21%)
// Prime Day (Jul): spike. Black Friday (Nov): spike. Big Billion Days (Oct): spike.
// PY YTD (Jan-Apr 2025): ~90 orders → ~$165 AOV → ~$14,850
// CY YTD (Jan-Apr 2026): ~120 orders → ~$148 AOV → ~$17,760 (+20% rev, +33% orders, -10% AOV)
const monthlyOrderTargets = {
  '2025-01': 20, '2025-02': 20, '2025-03': 25, '2025-04': 25,
  '2025-05': 26, '2025-06': 26, '2025-07': 44, // Prime Day spike
  '2025-08': 28, '2025-09': 28, '2025-10': 48, // Big Billion Days
  '2025-11': 52, // Black Friday
  '2025-12': 28,
  '2026-01': 32, '2026-02': 30, '2026-03': 34, '2026-04': 28,
};

// Generate date slots per month based on targets
const dateBuckets = [];
Object.entries(monthlyOrderTargets).forEach(([mk, target]) => {
  const [yr, mo] = mk.split('-').map(Number);
  for (let i = 0; i < target; i++) {
    const day = randInt(1, 28);
    dateBuckets.push(new Date(yr, mo - 1, day));
  }
});
dateBuckets.sort((a, b) => a - b);

const rows = [];
let orderNum = 0;
const ordersByMonth = {};

for (let dateIdx = 0; dateIdx < dateBuckets.length; dateIdx++) {
  const orderDate = dateBuckets[dateIdx];
  const is2026 = orderDate.getFullYear() === 2026;
  const mk = monthKey(orderDate);

  // Find eligible customers for this date:
  // 1. New customers whose firstDate <= orderDate AND haven't ordered yet (first purchase)
  // 2. Returning customers who already ordered AND enough time passed since last order AND haven't maxed out
  const newEligible = custs.filter(c => c.orders === 0 && orderDate >= c.firstDate);
  const returnEligible = custs.filter(c => {
    if (c.orders === 0 || c.orders >= c.maxOrders) return false;
    if (!c.lastOrderDate) return false;
    const daysSinceLast = daysBtw(c.lastOrderDate, orderDate);
    // Add some randomness: they might come back a bit early or late
    const jitter = randInt(-5, 10);
    return daysSinceLast >= (c.repurchaseGapDays + jitter);
  });

  // Decide: new or returning customer?
  // Early months: mostly new. Over time: returning pool grows naturally.
  // This creates the organic new→returning shift without forcing percentages.
  let cust = null;
  if (newEligible.length === 0 && returnEligible.length === 0) continue;

  if (returnEligible.length === 0) {
    // Only new customers available
    cust = newEligible[randInt(0, Math.min(4, newEligible.length - 1))];
  } else if (newEligible.length === 0) {
    // Only returning customers available
    cust = returnEligible[randInt(0, Math.min(9, returnEligible.length - 1))];
  } else {
    // Both available — weight toward returning as pool grows
    // Returning pool naturally grows over time, so this ratio shifts automatically
    const returnWeight = Math.min(0.75, returnEligible.length / (returnEligible.length + newEligible.length) + 0.1);
    if (rand() < returnWeight) {
      cust = returnEligible[randInt(0, Math.min(9, returnEligible.length - 1))];
    } else {
      cust = newEligible[randInt(0, Math.min(4, newEligible.length - 1))];
    }
  }

  const isFirst = cust.orders === 0;
  const daysSince = isFirst ? 0 : daysBtw(cust.firstDate, orderDate);
  const daysSinceLast = (isFirst || !cust.lastOrderDate) ? 0 : daysBtw(cust.lastOrderDate, orderDate);

  orderNum++;
  cust.orders++;
  cust.lastOrderDate = orderDate;

  const orderId = `ORD${String(orderNum).padStart(6, '0')}`;
  const sessionId = `S${String(orderNum).padStart(5, '0')}`;
  const campaign = getCampaign(orderDate, isFirst);
  const source = getSource(campaign, is2026);
  const channel = rand() < 0.7 ? cust.prefCh : pick(['Amazon', 'Shopify']);
  const device = rand() < 0.65 ? cust.prefDev : pick(['mobile', 'desktop', 'tablet']);
  const discPct = getDiscount(campaign);
  const adSpend = getAdSpend(campaign, source, is2026);
  const payment = getPayment(isFirst, orderDate);

  // 2026 more single-item orders → AOV dips ~10-12%
  const numItems = is2026
    ? wPick([1, 2, 3, 4], [44, 34, 16, 6])
    : wPick([1, 2, 3, 4], [26, 38, 24, 12]);

  // Track for verification
  if (!ordersByMonth[mk]) ordersByMonth[mk] = { newOrders: 0, returnOrders: 0 };
  if (isFirst) ordersByMonth[mk].newOrders++;
  else ordersByMonth[mk].returnOrders++;

  const used = new Set();
  for (let ln = 0; ln < numItems; ln++) {
    let prod, tries = 0;
    do { prod = wPick(products, pw); tries++; } while (used.has(prod.id) && tries < 30);
    if (used.has(prod.id)) continue;
    used.add(prod.id);

    const qty = wPick([1, 2, 3, 4, 5], [28, 36, 22, 10, 4]);
    const sub = +(qty * prod.price).toFixed(2);
    const disc = +(sub * discPct / 100).toFixed(2);
    const total = +(sub - disc).toFixed(2);
    const cogs = +(qty * prod.cogs).toFixed(2);
    const profit = +(total - cogs).toFixed(2);
    const lineAd = +(adSpend / numItems).toFixed(2);

    rows.push([
      orderId, ln + 1, cust.id, fmt(orderDate), fmt(orderDate),
      prod.id, prod.name, prod.cat, qty, prod.price.toFixed(2),
      sub.toFixed(2), discPct, disc.toFixed(2), total.toFixed(2),
      prod.cogs.toFixed(2), cogs.toFixed(2), profit.toFixed(2), lineAd.toFixed(2),
      campaign, channel, source, device, sessionId,
      isFirst ? 'TRUE' : 'FALSE', cust.cohort, daysSince, daysSinceLast,
      cust.ltv.toFixed(2), payment
    ].join(','));
  }
}

const headers = 'order_id,order_line_id,customer_id,order_date,created_at,product_id,product_name,category,quantity,unit_price,line_subtotal,discount_pct,line_discount,line_total,cogs_per_unit,line_cogs,line_gross_profit,ad_spend_allocated,campaign,channel,source,device,session_id,is_first_time_customer,cohort,days_since_first,days_since_last_order,customer_lifetime_value,payment_method';
fs.writeFileSync('C:\\Users\\jaina\\OneDrive\\Desktop\\POC\\lightdash\\sample_data\\ecommerce_orders.csv', headers + '\n' + rows.join('\n') + '\n');

// ─── VERIFY STORY ────────────────────────────────────
const py_ytd = rows.filter(r => { const d = r.split(',')[3]; return d.startsWith('2025-') && parseInt(d.split('-')[1]) <= 4; });
const cy_ytd = rows.filter(r => { const d = r.split(',')[3]; return d.startsWith('2026-') && parseInt(d.split('-')[1]) <= 4; });
const sumF = (arr, idx) => arr.reduce((s, r) => s + parseFloat(r.split(',')[idx]), 0);
const cntD = (arr, idx) => new Set(arr.map(r => r.split(',')[idx])).size;

const pyRev = sumF(py_ytd, 13), cyRev = sumF(cy_ytd, 13);
const pyProfit = sumF(py_ytd, 16), cyProfit = sumF(cy_ytd, 16);
const pyAd = sumF(py_ytd, 17), cyAd = sumF(cy_ytd, 17);
const pyOrd = cntD(py_ytd, 0), cyOrd = cntD(cy_ytd, 0);

console.log('\n=== STORY VERIFICATION (Jan-Apr YTD) ===');
console.log(`Revenue:  PY $${pyRev.toFixed(0)} → CY $${cyRev.toFixed(0)} (${(((cyRev-pyRev)/pyRev)*100).toFixed(1)}%)`);
console.log(`Profit:   PY $${pyProfit.toFixed(0)} → CY $${cyProfit.toFixed(0)} (${(((cyProfit-pyProfit)/pyProfit)*100).toFixed(1)}%)`);
console.log(`Orders:   PY ${pyOrd} → CY ${cyOrd} (${(((cyOrd-pyOrd)/pyOrd)*100).toFixed(1)}%)`);
console.log(`AOV:      PY $${(pyRev/pyOrd).toFixed(1)} → CY $${(cyRev/cyOrd).toFixed(1)} (${((((cyRev/cyOrd)-(pyRev/pyOrd))/(pyRev/pyOrd))*100).toFixed(1)}%)`);
console.log(`Ad Spend: PY $${pyAd.toFixed(0)} → CY $${cyAd.toFixed(0)} (${(((cyAd-pyAd)/pyAd)*100).toFixed(1)}%)`);
console.log(`ROAS:     PY ${(pyRev/pyAd).toFixed(1)}x → CY ${(cyRev/cyAd).toFixed(1)}x (${((((cyRev/cyAd)-(pyRev/pyAd))/(pyRev/pyAd))*100).toFixed(1)}%)`);
console.log(`Margin:   PY ${((pyProfit/pyRev)*100).toFixed(1)}% → CY ${((cyProfit/cyRev)*100).toFixed(1)}%`);

// New vs Returning by month
console.log('\n=== NEW vs RETURNING ORDERS BY MONTH ===');
Object.entries(ordersByMonth).sort().forEach(([m, v]) => {
  const total = v.newOrders + v.returnOrders;
  const retPct = ((v.returnOrders / total) * 100).toFixed(1);
  console.log(`  ${m}: ${v.newOrders} new + ${v.returnOrders} returning = ${total} orders (${retPct}% returning)`);
});

// COD trend by quarter
console.log('\n=== COD % BY QUARTER ===');
const quarters = {};
rows.forEach(r => {
  const f = r.split(',');
  const d = f[3], pay = f[28];
  const y = d.substring(0, 4);
  const m = parseInt(d.split('-')[1]);
  const q = `${y}-Q${Math.ceil(m/3)}`;
  if (!quarters[q]) quarters[q] = { total: 0, cod: 0 };
  quarters[q].total++;
  if (pay === 'COD') quarters[q].cod++;
});
Object.entries(quarters).sort().forEach(([q, v]) => {
  console.log(`  ${q}: COD ${((v.cod/v.total)*100).toFixed(1)}% (${v.cod}/${v.total})`);
});

// Cohort customer counts
console.log('\n=== COHORT CUSTOMER COUNTS (first orders) ===');
const cohorts = {};
rows.forEach(r => {
  const f = r.split(',');
  if (f[23] === 'TRUE') {
    const co = f[24];
    cohorts[co] = (cohorts[co] || 0) + 1;
  }
});
Object.entries(cohorts).sort().forEach(([k, v]) => console.log(`  ${k}: ${v} new customers`));

// Reorder window distribution
console.log('\n=== REORDER WINDOW (days_since_last_order) ===');
const reorder = {'First Purchase':0, '1-30 days':0, '31-60 days':0, '61-90 days':0, '90+ days':0};
rows.forEach(r => {
  const d = parseInt(r.split(',')[26]);
  if (d === 0) reorder['First Purchase']++;
  else if (d <= 30) reorder['1-30 days']++;
  else if (d <= 60) reorder['31-60 days']++;
  else if (d <= 90) reorder['61-90 days']++;
  else reorder['90+ days']++;
});
Object.entries(reorder).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

console.log(`\nTotal lines: ${rows.length}`);
console.log(`Total orders: ${cntD(rows, 0)}`);
console.log(`Total customers: ${cntD(rows, 2)}`);
