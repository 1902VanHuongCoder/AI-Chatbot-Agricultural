import { Request, Response } from "express";
import {
  Category,
  Comment,
  Origin,
  Product,
  ProductTag,
  SubCategory,
  Tag,
  User,
} from "../models";
import { Op } from "sequelize";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Sort products by createdAt in descending order (latest first)
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productID } = req.params;

  try {
    const product = await Product.findByPk(productID, {
      include: [
        { model: Category, as: "category" }, // Include associated category
        { model: SubCategory, as: "subcategory" }, // Include associated subcategory
        { model: Tag }, // Include associated tags
        { model: Origin, as: "origin" }, // Include associated origin
        {
          model: Comment,
          as: "comments",
          include: [{ model: User, as: "user" }],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    productName,
    productPrice,
    productPriceSale,
    quantityAvailable,
    categoryID,
    tagIDs, // Array of tag IDs
    originID,
    subcategoryID,
    images,
    descriptionImages,
    description,
    unit,
    isShow,
    expiredAt,
  } = req.body;

  console.log("Request body:", req.body);

  try {
    // Create the product
    const newProduct = await Product.create({
      productName,
      productPrice,
      productPriceSale,
      quantityAvailable,
      categoryID,
      originID,
      subcategoryID,
      images,
      descriptionImages,
      description,
      rating: 5,
      unit,
      isShow,
      expiredAt,
    });

    // Increment the count of the selected category
    if (categoryID) {
      await Category.increment("count", {
        by: 1,
        where: { categoryID: categoryID },
      });
    }

    // Handle tags
    if (tagIDs && Array.isArray(tagIDs)) {
      const productTags = tagIDs.map((tagID: number) => ({
        productID: newProduct.productID,
        tagID,
      }));

      await ProductTag.bulkCreate(productTags);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productID } = req.params;
  const {
    productName,
    productPrice,
    productPriceSale,
    quantityAvailable,
    categoryID,
    tagIDs,
    originID,
    subcategoryID,
    images,
    descriptionImages,
    description,
    unit,
    isShow,
    expiredAt,
  } = req.body;

  try {
    const product = await Product.findByPk(productID);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Update the product
    await product.update({
      productName,
      productPrice,
      productPriceSale,
      quantityAvailable,
      categoryID,
      originID,
      subcategoryID,
      images,
      descriptionImages,
      description,
      unit,
      isShow,
      expiredAt,
    });

    // Handle tags
    if (tagIDs && Array.isArray(tagIDs)) {
      // Delete existing tags for the product
      await ProductTag.destroy({ where: { productID: productID } });

      // Add updated tags
      const productTags = tagIDs.map((tagID: number) => ({
        productID: productID,
        tagID,
      }));

      await ProductTag.bulkCreate(productTags);
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productID } = req.params;

  try {
    const product = await Product.findByPk(productID);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Delete related records in ProductTag and ProductAttribute
    await ProductTag.destroy({ where: { productID: productID } });

    // Delete the product
    await product.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};


// Get products by product name which is a query parameter
export const getProductByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "Product name is required" });
    return;
  }

  try {
    const products = await Product.findAll({
      where: {
        productName: {
          [Op.like]: `%${name}%`, // Use LIKE for partial matching
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (products.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by name:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}
