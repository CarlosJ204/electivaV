export const C = {
  brand: "#6257D9",
  bg: "#F4F5FB",
  card: "#FFFFFF",
  text: "#20233A",
  muted: "#777B91",
  line: "#E4E6F2",
  income: "#2E9D72",
  incomeSoft: "#E3F5EC",
  expense: "#E85D75",
  expenseSoft: "#FDE8EC",
};

/** Formatea pesos colombianos: 1234567 -> "$1.234.567" */
export const money = (n: number): string =>
  "$" + Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
