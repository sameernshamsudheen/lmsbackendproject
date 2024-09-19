const mongoose = require("mongoose");
const ErrorHandler = require("./errorHandler");

const generateLast12MonthsData = async (model) => {
  console.log(model, "12 moths model====");
  try {
    const last12MonthsData = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 11; i >= 0; i--) {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - i * 28
      );

      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      last12MonthsData.push({ month: monthYear, count: count });
    }
    return { last12MonthsData };
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = { generateLast12MonthsData };
