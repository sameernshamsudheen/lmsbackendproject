const ErrorHandler = require("../../utils/errorHandler");

const catchAsyncError = require("../../middleware/catchasyncerror");
const layoutModel = require("../../models/layout/layout");
const cloudinary = require("cloudinary");

const Layout = catchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.body;
    const isTypeExist = await layoutModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exist`, 400));
    }

    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      await layoutModel.create();
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };
    }
    if (type === "FAQ") {
      try {
        const { faq } = req.body;
        console.log(faq, "===faq====");
        const faqItems = await Promise.all(
          faq.map(async (item) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await layoutModel.create({ type: "FAQ", faq: faqItems });
      } catch (error) {
        console.log(error.message);
      }
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesItems = await Promise.all(
        categories.map(async (item) => {
          return {
            title: item.title,
          };
        })
      );
      await layoutModel.create({
        type: "Categories",
        categories: categoriesItems,
      });
    }
    res.status(200).json({
      success: true,
      message: "layout created successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const editLayout = catchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type === "Banner") {
      const { image, title, subTitle } = req.body;

      const bannerData = await layoutModel.findOne({ type: "Banner" });
      if (bannerData) {
        await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };
      await layoutModel.findByIdAndUpdate(bannerData.id, { banner });
    }
    if (type === "FAQ") {
      try {
        const { faq } = req.body;
        const FaqId = await layoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map(async (item) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await layoutModel.findByIdAndUpdate(FaqId._id, {
          type: "FAQ",
          faq: faqItems,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesId = await layoutModel.findOne({ type: "Categories" });
      const categoriesItems = await Promise.all(
        categories.map(async (item) => {
          return {
            title: item.title,
          };
        })
      );
      console.log(categoriesId, "===items----");

      await layoutModel.findByIdAndUpdate(categoriesId._id, {
        type: "Categories",
        categories: categoriesItems,
      });
    }
    res.status(200).json({
      success: true,
      message: "layout updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const getLayoutType = catchAsyncError(async (req, res, next) => {
  try {
    const { type } = req.body;
    const layout = await layoutModel.findOne({ type });

    res.status(201).json({
      success: true,
      layout,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
module.exports = { Layout, editLayout, getLayoutType };
