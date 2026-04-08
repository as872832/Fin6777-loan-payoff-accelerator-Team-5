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
    return { ...d, balance, rate, minPayment, termMonths };
  });

  const sorted = strategy === 'avalanche'
    ? remaining.sort((a, b) => b.rate - a.rate)
    : remaining.sort((a, b) => a.balance - b.balance);

  let months = 0;
  let totalInterest = 0;
  const balancesByMonth = [sorted.reduce((sum, d) => sum + d.balance, 0)];

  while (sorted.some(d => d.balance > 0) && months < 600) {
    months++;
    let extraLeft = extra;

    for (let i = 0; i < sorted.length; i++) {
      const d = sorted[i];
      if (d.balance <= 0) continue;

      const interest = d.balance * (d.rate / 12);
      totalInterest += interest;
      d.balance += interest;
      d.balance -= d.minPayment;

      if (i === 0 && extraLeft > 0) {
        d.balance -= extraLeft;
        extraLeft = 0;
      }

      if (d.balance <= 0) {
        const freed = Math.abs(d.balance);
        d.balance = 0;
        if (i + 1 < sorted.length) {
          sorted[i + 1].minPayment += d.minPayment;
          if (freed > 0) extraLeft += freed;
        }
      }
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