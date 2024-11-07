const express = require("express");
const {
  addtransaction,
  getAlltransaction,
  editTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

//router object
const router = express.Router();

//routes
//add transaction POST MEthod
router.post("/add-transaction", addtransaction);
//Edit transaction POST MEthod
router.post("/edit-transaction", editTransaction);
//Delete transection POST MEthod
router.post("/delete-transaction", deleteTransaction);
//get transactions
router.post("/get-transaction", getAlltransaction);

module.exports = router;