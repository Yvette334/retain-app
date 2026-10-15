require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("./models/user");
const Category = require("./models/category");
const Expense = require("./models/expense");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO || process.env.MONGO);
    console.log("Connect to MongoDB");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Expense.deleteMany({});
    console.log("Removed old data");

    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: "retain123",
        role: i === 0 ? "user" : "admin",
      });
    }
    const createUsers = await User.insertMany(users);
    console.log(`Created ${createUsers.length} users`);

    const categoryNames = [
      "Food",
      "Shopping",
      "Health",
      "Entertainment",
      "Transport",
    ];
    const categories = categoryNames.map((name) => ({ name }));
    const createCategories = await Category.insertMany(categories);
    console.log(`Created ${createCategories.length} categories`);

    const expenses = [];
    for (let i = 0; i < 50; i++) {
      const randomUser = faker.helpers.arrayElement(createUsers);
      const randomCategory = faker.helpers.arrayElement(createCategories);

      expenses.push({
        user: randomUser._id,
        category: randomCategory._id,
        title: faker.commerce.productName(),
        amount: parseFloat(faker.finance.amount({ min: 5, max: 200, dec: 2 })),
        date: faker.date.recent({ days: 40 }),
      });
    }
    const createExpenses = await Expense.insertMany(expenses);
    console.log(`Created ${createExpenses.length} expenses`);

    console.log("Seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};
seedDB();
