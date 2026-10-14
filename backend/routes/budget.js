const express = require("express")
const Budget = require("../models/budget")
const {auth} = require("../middleware/auth")
const handler = require("../utils/handler")
const {isValidMonth} = require("../utils/month")
const buildSummary = require("../utils/budgetSummary")

const router = express.Router();
router.use(auth);

router.get(
    "/:month",
    handler(async(req, res) => {
        const {month} = req.params;
        if (!isValidMonth(month)) return res.status(400).json({message: "A valid month look like 2026-10"})
        res.json(await buildSummary(req.user._id, month))
    })
)

router.put(
    "/:month",
    handler(async(req, res) => {
        const {month} = req.params
        const amount = Number(req.body.amount)

        if(!isValidMonth(month)) return res.status(400).json({message:"A valid month look like 2026-10"})
        if(!amount || amount <= 0) return res.status(400).json({message:"The budget must be greater than 0 "})
        
        await Budget.findOneAndUpdate(
            { user: req.user._id, month},
            {amount},
            {upsert: true, new: true, runValidators: true}
        )
        res.json(await buildSummary(req.user._id, month))
    })
)
module.exports = router;