function calcRequiredPayment(balance, annualRate, termMonths) {
  const r = annualRate / 12;
  const n = termMonths;
  if (!r || !n) return balance / n;
  return (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcPayoff(debts, strategy, extra = 0) {
  let remaining = debts.map(d => {
    const balance = parseFloat(d.balance) || 0;
    const rate = (parseFloat(d.rate) || 0) / 100;
    const termMonths = d.termMonths ? parseInt(d.termMonths) : null;
    const enteredMin = parseFloat(d.minPayment) || 0;
    const requiredMin = termMonths ? calcRequiredPayment(balance, rate, termMonths) : null;
    const minPayment = requiredMin ? Math.max(enteredMin, requiredMin) : enteredMin;
    return { ...d, balance, rate, minPayment, originalMin: minPayment };
  });

  const sorted = strategy === 'avalanche'
    ? [...remaining].sort((a, b) => b.rate - a.rate)
    : [...remaining].sort((a, b) => a.balance - b.balance);

  let months = 0;
  let totalInterest = 0;
  const balancesByMonth = [sorted.reduce((sum, d) => sum + d.balance, 0)];

  while (sorted.some(d => d.balance > 0) && months < 600) {
    months++;

    // Step 1: apply interest to all debts
    for (const d of sorted) {
      if (d.balance <= 0) continue;
      const interest = d.balance * (d.rate / 12);
      totalInterest += interest;
      d.balance += interest;
    }

    // Step 2: figure out total available payment this month
    const totalMinimums = sorted.reduce((sum, d) => d.balance > 0 ? sum + d.minPayment : sum, 0);
    let available = totalMinimums + extra;

    // Step 3: apply minimums to all debts first
    for (const d of sorted) {
      if (d.balance <= 0) continue;
      const payment = Math.min(d.minPayment, d.balance);
      d.balance -= payment;
      available -= payment;
    }

    // Step 4: apply remaining available (extra + any overpaid minimums) to target debt
    for (const d of sorted) {
      if (d.balance <= 0) continue;
      const payment = Math.min(available, d.balance);
      d.balance -= payment;
      available -= payment;
      if (available <= 0) break;
    }

    // Step 5: floor negatives to zero
    for (const d of sorted) {
      if (d.balance < 0) d.balance = 0;
    }

    balancesByMonth.push(
      Math.max(0, sorted.reduce((sum, d) => sum + d.balance, 0))
    );
  }

  return { months, totalInterest, balancesByMonth };
}

export function calcWhatIf(debts, strategy, extra = 0) {
  const baseline = calcPayoff(debts, strategy, 0);
  const accelerated = calcPayoff(debts, strategy, extra);
  return {
    baselineMonths: baseline.months,
    acceleratedMonths: accelerated.months,
    monthsSaved: baseline.months - accelerated.months,
    interestSaved: baseline.totalInterest - accelerated.totalInterest,
    baselineBalances: baseline.balancesByMonth,
    acceleratedBalances: accelerated.balancesByMonth
  };
}