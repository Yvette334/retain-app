const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("./models/user");
const Budget = require("./models/budget");
const Category = require("./models/category");
const Expense = require("./models/expense");

function randomDate (days){
  const date = faker.date.recent({days})
  date.setUTCHours(0, 0, 0, 0)
  return date;
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO || process.env.MONGO);
    console.log("Connect to MongoDB");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Expense.deleteMany({});
    await Budget.deleteMany({});
    console.log("Removed old data");

    const userPass = await bcrypt.hash("User123", 10);
    const adminPass = await bcrypt.hash("Admin123", 10);
    const users = [
      {
        name: "User",
        email: "user@gmail.com",
        password: userPass,
        role: "user",
      },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: adminPass,
        role: "admin",
      },
    ];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: userPass,
        role: "user",
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
      "Uncategorized",
    ];
    const categories = categoryNames.map((name) => ({
      name,
      isDefault: name === "Uncategorized",
    }));
    const createCategories = await Category.insertMany(categories);
    console.log(`Created ${createCategories.length} categories`);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = createUsers.map((u) => ({
      user: u._id,
      month: currentMonth,
      amount: 2500,
    }));
    const createBudgets = await Budget.insertMany(budgets);
    console.log(`Created ${createBudgets.length} budgets`);

    const test = createUsers.find((u) => u.email === "user@gmail.com");
    const payMethods = ["Cash", "Mobile money", "Card"];
    const expenses = [
      {
        user: test._id,
        category: createCategories[1]._id,
        title: "Going to the mall",
        amount: 400.0,
        payMethod: "Card",
        date: randomDate(1),
      },
    ];

    for(let i = 0; i <30; i++){
      expenses.push({
        user: test._id,
        category: faker.helpers.arrayElement(createCategories)._id,
        title: faker.commerce.productName(),
        amount: parseFloat(faker.finance.amount({ min: 5, max: 200, dec: 2 })),
        payMethod: faker.helpers.arrayElement(payMethods) ,
        date: randomDate(40),
      });
    }

    for (let i = 0; i < 20; i++) {
      const randomUser = faker.helpers.arrayElement(createUsers);
      const randomCategory = faker.helpers.arrayElement(createCategories);
      const randomPayMethod = faker.helpers.arrayElement(payMethods);

      expenses.push({
        user: randomUser._id,
        category: randomCategory._id,
        title: faker.commerce.productName(),
        amount: parseFloat(faker.finance.amount({ min: 5, max: 200, dec: 2 })),
        payMethod: randomPayMethod,
        date: randomDate(40),
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
