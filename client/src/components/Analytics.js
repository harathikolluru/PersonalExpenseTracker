import React from "react";
import { Progress } from "antd";
const Analytics = ({ alltransaction }) => {
  // category
  const categories = [
    "salary",
    "freelance",
    "stocks",
    "rent",
    "utilities",
    "food",
    "entertainment",
    "bills",
    "medical",
    "miscellaneous",
  ];

  // total transaction
  const totalTransaction = alltransaction.length;
  const totalIncomeTransactions = alltransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = alltransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100;

  //total turnover
  const totalTurnover = alltransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = alltransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = alltransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100;
  return (
    <>
      <div className="row m-3">
        <div className="col-md-4">
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <h4>Categorywise Income</h4>
          {categories.map((category) => {
            const amount = alltransaction
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalIncomeTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-4">
          <h4>Categorywise Expense</h4>
          {categories.map((category) => {
            const amount = alltransaction
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Analytics;