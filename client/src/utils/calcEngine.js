export function calcPayoff(debts, strategy, extra = 0) {
  let remaining = debts.map(d => ({
    ...d,
    balance: parseFloat(d.balance),
    rate: parseFloat(d.rate) / 100,
    minPayment: parseFloat(d.minPayment)
  }));

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

      if (i === 0) {
        d.balance -= extraLeft;
        extraLeft = 0;
      }

      if (d.balance < 0) {
        if (i + 1 < sorted.length) {
          sorted[i + 1].minPayment += d.minPayment;
        }
        d.balance = 0;
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