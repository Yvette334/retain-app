const express = require("express")
const Category = require("../models/category")
const {auth, adminOnly} = require("../middleware/auth")
const handler = require("../utils/handler")
const Expense = require("../models/expense")

const router = express.Router()

router.get(
    "/", auth,
    handler(async(req, res) => {
        res.json(await Category.find().sort({name: 1}));
    })
)

router.post(
    "/", auth, adminOnly,
    handler(async(req, res) => {
        const category = await Category.create({name: req.body.name})
        res.status(201).json(category)
    })
)

router.put(
    "/:id", auth, adminOnly,
    handler(async(req, res) => {
        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({message: "Category not found"})
        if (category.isDefault) return res.status(400).json({message: "Can not change the category"})
        
        category.name = req.body.name
        await category.save()
        res.json(category)
    })
)

router.delete(
    "/:id", auth, adminOnly,
    handler(async(req, res) => {
        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({message: "Category not found"})
        if (category.isDefault) return res.status(400).json({message: "Can not delete the category"})

        const defaultCat = await Category.findOne({isDefault: true})
        await Expense.updateMany({category: category._id}, {category: defaultCat._id})
        await category.deleteOne();

        res.json({message: "Category deleted, Expenses changed to Uncategorized"})
    })
)

module.exports = router