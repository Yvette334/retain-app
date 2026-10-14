const express = require("express")
const Expense = require("../models/expense")
const {auth} = require("../middleware/auth")
const handler = require("../utils/handler")

const router = express.Router();
router.use(auth);

router.get(
    "/",
    handler(async(req, res) => {
        const {search, category, payMethod, startDate, endDate, minAmount, maxAmount} = req.query;
        const sortBy = req.query.sortBy === "amount" ? "amount" : "date";
        const order = req.query.order === "asc" ? 1 : -1;
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const filter = {user: req.user._id};

        if(search) {
            const protect = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.title = {$regex: protect, $options: "i"};
        }
        if (category) filter.category = category;
        if (payMethod) filter.payMethod = payMethod;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {}
            if (minAmount) filter.amount.$gte = Number(minAmount);
            if (maxAmount) filter.amount.$lte = Number(maxAmount);
        }
            const total = await Expense.countDocuments(filter);
            const expenses = await Expense.find(filter)
                .populate("category", "name")
                .sort({[sortBy]: order})
                .skip((page - 1) * limit)
                .limit(limit)

            res.json({expenses, total, page, pages: Math.ceil(total / limit)});
        })
)

router.get(
    "/:id",
    handler(async(req, res) => {
        const expense = await Expense.findOne({_id: req.params.id, user: req.user._id}).populate("category", "name");
        if (!expense) 
            return res.status(404).json({message: "Expense not found"});
            res.json(expense);
    })
)

router.post(
    "/",
    handler(async(req, res) => {
        const {title, amount, category, date, payMethod, notes} = req.body;
        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount, 
            category, 
            date, 
            payMethod, 
            notes,
        });
        await expense.populate("category", "name");
        res.status(201).json(expense);
    })
)

router.put(
    "/:id",
    handler(async(req, res) => {
        const expense = await Expense.findOne({_id: req.params.id, user: req.user._id});
        if(!expense) return res.status(404).json({message:"Expense not found"});
        ["title", "amount", "category", "date", "payMethod", "notes"].forEach((field) => {
            if(req.body[field] !== undefined) expense[field] = req.body[field];
        });

        await expense.save();
        await expense.populate("category", "name")
        res.json(expense);
    })
)

router.delete(
    "/:id",
    handler(async(req, res) => {
        const expense = await Expense.findOneAndDelete({_id: req.params.id, user: req.user._id});
        if (!expense) return res.status(404).json({message: "Expense not found"})
            res.json({message: "Expense deleted"});
    })
)

module.exports = router;
