import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(401).send({message:"Name is required"})
    }
    const existingCategory = await CategoryModel.findOne({ name })
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message:"Category Already Exists"
      })
    }
    const category = await new CategoryModel({ name, slug: slugify(name) }).save()
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category
    })
  } catch (error) {
    // console.log(error)
    res.status(500).send({
      success: false,
      error,
      message:"Error in Category Controller"
    })
  }
};

//update category

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "error while updating category",
      error,
    });
  }
};

// get category

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category Fetched Successfully",
      category,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting all category",
      error,
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Single Category Fetched Successfully",
      category,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting single category",
      error
    });
  }
};

export const deleteCategoryController = async (req,res) => {
    // delete category
    try {
      const { id } = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message:"Category Deleted Successsfully"
        })
      } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: "error while deleting category",
            error,
          })
        }
}

