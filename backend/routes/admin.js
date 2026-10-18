const express = require("express");
const User = require("../models/user");
const { auth, adminOnly } = require("../middleware/auth");
const handler = require("../utils/handler");
const Expense = require("../models/expense");
const Category = require("../models/category");
const { monthRange, currentMonth } = require("../utils/month");

const router = express.Router();
router.use(auth, adminOnly);

router.get(
  "/insights",
  handler(async (req, res) => {
    const { start, end } = monthRange(currentMonth());

    const [
      totalUsers,
      totalExpenses,
      valueResult,
      expensesThisMonth,
      categories,
      stats,
      recentUsers,
      recentExpenses,
    ] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.countDocuments({ date: { $gte: start, $lt: end } }),
      Category.find(),
      Expense.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      Expense.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .populate("category", "name"),
    ]);
    const statsById = {};
    stats.forEach((s) => {
      statsById[s._id] = s;
    });

    const spendingCat = categories.map((c) => {
      const s = statsById[String(c._id)];
      return {
        id: c._id,
        name: c.name,
        count: s ? s.count : 0,
        total: s ? s.total : 0,
      };
    });

    const most = [...spendingCat].sort((a, b) => b.count - a.count);
    const least = [...spendingCat].sort((a, b) => a.count - b.count);

    res.json({
      totalUsers,
      totalExpenses,
      totalValue: valueResult.length > 0 ? valueResult[0].total : 0,
      expenses: expensesThisMonth,
      spendingCat,
      top: most.slice(0, 5),
      bottom: least.slice(0, 5),
      recentUsers,
      recentExpenses,
    });
  }),
);

module.exports = router;
