const Budget = require("../models/budget");
const Expense = require("../models/expense");
const {monthRange} = require("./month");


async function getSummary(userId, month) {
    const {start, end} = monthRange(month);

    const [budget, expense] = await Promise.all([
        Budget.findOne({user: userId, month}),
        Expense.find({user: userId, date: {$gte:start, $lt: end}}),
    ]);

    const spent = expense.reduce((sum, item) => sum + item.amount, 0);
    const amount = budget ? budget.amount : 0;

    let status = "no budget";
    if(budget){
        const ratio = amount > 0 ? spent / amount : (spent > 0 ? 2 : 0);
        
        if(ratio > 1) {
            status = "over budget";
        }
        else if (ratio >= 0.8) {
            status = "approaching";
        }
        else {
            status = "within"
        }
    }

    return {
        month, budget: amount, spent, remaining: amount - spent, status,
    };
}

module.exports = getSummary;