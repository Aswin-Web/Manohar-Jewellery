// const express = require('express')
// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

// const getAllProducts = async (req, res) => {
//     try {
//         const getProducts = await prisma.product_info.findMany();
//         res.status(200).json(getProducts);
//     } catch (error) {
//         console.log(error);
//         res.status(404).json({ error: "No Products found" });
//     }
// }
// const getProductByNumber = async (req, res) => {
//   try {
//       const { product_number } = req.params;

//       const product = await prisma.product_info.findUnique({
//           where: { product_number },
//           select: {
//             id : true,
//               product_number: true,
//               before_weight: true,
//               after_weight: true,
//               difference: true,
//               adjustment: true,
//               final_weight: true,
//               tag_number: true,
//               created_at: true,
//               updated_at: true
//           }
//       });

//       res.status(200).json({ message: "Product found", product });
//   } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "An error occurred while fetching the product" });
//   }
// };

// const createNewProduct = async (req, res) => {
//     try {
//       const { tag_number, before_weight, after_weight, product_number } = req.body;

//       const weight1 = parseFloat(before_weight);
//       const weight2 = parseFloat(after_weight);

//       const weight3 = weight1 - weight2;
//       const weight4 = weight3 - (weight3 * 0.0001);
//       const weight5 = weight4 - (weight4 * 0.1);

//       let finalProductNumber = product_number || '';

//       if (!finalProductNumber) {

//         const weight5Str = Math.abs(weight5).toFixed(3).replace('.', '').slice(0, 3);

//         const latestProduct = await prisma.product_info.findFirst({
//           orderBy: {
//             created_at: "desc"
//           }
//         });

//         if (latestProduct && latestProduct.product_number) {
//           const lastSerialNumber = latestProduct.product_number;
//           const lastLetter = lastSerialNumber.charAt(0);

//           if (lastSerialNumber.endsWith('99')) {

//             finalProductNumber = `${String.fromCharCode(lastLetter.charCodeAt(0) + 1)}00${weight5Str}`;
//           } else {

//             finalProductNumber = `${lastLetter}00${weight5Str}`;
//           }
//         } else {

//           finalProductNumber = `A00${weight5Str}`;
//         }
//       }

//       const newProduct = await prisma.product_info.create({
//         data: {
//           tag_number,
//           before_weight: weight1,
//           after_weight: weight2,
//           difference: weight3,
//           adjustment: weight4,
//           final_weight: weight5,
//           product_number: finalProductNumber,
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       });

//       res.status(200).json({ message: "Product Successfully Created", newProduct });
//     } catch (error) {
//       console.log(error);
//       res.status(404).json({ error: "Error Creating Product" });
//     }
//   };

// const UpdatingProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { tag_number,before_weight,after_weight,difference,adjustment,final_weight, product_number } = req.body;

//         const updateProduct = await prisma.product_info.update({
//             where: { id: parseInt(id) },
//             data: {
//                 tag_number,
//                 before_weight,
//                 after_weight,
//                 difference,
//                 adjustment,
//                 final_weight,
//                 product_number,
//                 updated_at: new Date(),
//             }
//         });

//         res.status(200).json({ message: "Updated Successfully", updateProduct });
//     } catch (error) {
//         console.log(error);
//         res.status(404).json({ error: "Product not Updated" });
//     }
// };

// const deleteProduct = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const delProduct = await prisma.product_info.delete({
//         where: { id: parseInt(id) },
//       });
//       res.status(200).json({ message: "Deleted Successfully", delProduct });
//     } catch (error) {
//       console.log(error);
//       res.status(404).json({ error: "Product not deleted" });
//     }
//   };

// const deleteAllProduct = async (req, res) => {
//     try {
//         const deleteAllProducts = await prisma.product_info.deleteMany();
//         res.status(200).json({ message: "Deleted Successfully", deleteAllProducts });
//     } catch (error) {
//         console.log(error);
//         res.status(404).json({ error: "Can't delete All Product" });
//     }
// };

// module.exports = { getAllProducts, createNewProduct,getProductByNumber, UpdatingProduct, deleteProduct,deleteAllProduct }

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNewProduct = async (req, res) => {
  try {
    const {
      tag_number,
      before_weight,
      after_weight,
      product_number,
      lot_id,
      barcode_weight,
    } = req.body;

    const weight1 = parseFloat(before_weight);
    const weight2 = parseFloat(after_weight);

    // const weight3 = parseFloat((weight1 - weight2).toFixed(3));
    // const weight4 = parseFloat((weight3 - (weight3 * 0.0001)).toFixed(3));
    // const weight5 = parseFloat((weight4 - (weight4 * 0.1)).toFixed(3));

    // const weight5Str = "123"

    // const finalProductNumber = `${tag_number}00${weight5Str}`;
    const finalProductNumber = product_number;

    const newProduct = await prisma.product_info.create({
      data: {
        tag_number,
        before_weight: weight1,
        after_weight: weight2,
        // difference: weight3,
        // adjustment: weight4,
        // final_weight: weight5,
        barcode_weight: parseFloat(barcode_weight),
        product_number: tag_number + Math.random(4) * 1000,
        lot_id: lot_id,
      },
    });

    res.status(200).json({
      message: "Product Successfully Created",
      newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error Creating Product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const lot_id = parseInt(req.params.lot_id);
    const getProducts = await prisma.product_info.findMany({
      where: {
        lot_id,
      },
    });
    res.status(200).json(getProducts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No Products found" });
  }
};

const getProductByNumber = async (req, res) => {
  try {
    const { bill_number, product_number, bill_type } = req.params;
    const billing_type = bill_type === "party" ? "hold" : "sold";
    const product = await prisma.product_info.findMany({
      where: {
        product_number,
        product_type: "active",
        lot_info: { lot_process: "completed" },
      },
      select: {
        id: true,
        product_number: true,
        before_weight: true,
        after_weight: true,
        difference: true,
        adjustment: true,
        final_weight: true,
        tag_number: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (product.length === 0) {
      return res.status(500).json({ msg: "Product not found" });
    }
    const updateProduct = await prisma.product_info.updateMany({
      where: {
        id: product[0].id,
      },
      data: {
        product_type: billing_type,
      },
    });
    const billItem = await prisma.bill_items.create({
      data: {
        bill_number,
        product_id: product[0].id,
        created_at: new Date(),
      },
    });

    res.status(200).json({
      message: "Product found",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};

const restoreProductByNumber = async (req, res) => {
  try {
    const { product_number } = req.params;
    const billing_type = "active";
    const product = await prisma.product_info.updateMany({
      where: {
        product_number,
      },
      data: {
        product_type: billing_type,
      }
      
    });
    // console.log(product)
    if (product.length===0){
      res
      .status(500)
      .json({ error: "Product Not found" });
    
    }
    const product_info = await prisma.product_info.findMany({
      where: {
        product_number,
      },
      select: {
        id: true,
        product_number: true,
        before_weight: true,
        after_weight: true,
        difference: true,
        adjustment: true,
        final_weight: true,
        tag_number: true,
        created_at: true,
        updated_at: true,
      },
    });
    res.status(200).json({
      message: "Product found",
      product_info,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};

// const createNewProduct = async (req, res) => {
//     try {
//       const { tag_number, before_weight, after_weight } = req.body;
//       const {bill_number} = req.params;

//       const weight1 = parseFloat(before_weight);
//       const weight2 = parseFloat(after_weight);

//       const weight3 = (weight1 - weight2);
//       const weight4 = weight3 - (weight3 * 0.0001);
//       const weight5 = weight4 - (weight4 * 0.1);
//       const weight5Str = Math.abs(weight5).toFixed(3).replace('.', '').slice(0, 3);
//      const  finalProductNumber = `${tag_number}00${weight5Str}`

//               const newProduct = await prisma.product_info.create({
//         data: {
//           tag_number,
//           before_weight: weight1,
//           after_weight: weight2,
//           difference: weight3,
//           adjustment: weight4,
//           final_weight: weight5,
//           product_number: finalProductNumber,
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       });

//       res.status(200).json({
//         message: "Product Successfully Created",
//         newProduct,

//       });
//     } catch (error) {
//       console.log(error);
//       res.status(404).json({ error: "Error Creating Product" });
//     }
//   };

// const UpdatingProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { tag_number,before_weight,after_weight,difference,adjustment,final_weight, product_number } = req.body;

//         const updateProduct = await prisma.product_info.update({
//             where: { id: parseInt(id) },
//             data: {
//                 tag_number,
//                 before_weight,
//                 after_weight,
//                 difference,
//                 adjustment,
//                 final_weight,
//                 product_number,
//                 updated_at: new Date(),
//             }
//         });

//         res.status(200).json({ message: "Updated Successfully", updateProduct });
//     } catch (error) {
//         console.log(error);
//         res.status(404).json({ error: "Product not Updated" });
//     }
// };

const UpdatingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { before_weight, after_weight, barcode_weight } = req.body;

    const updateProduct = await prisma.product_info.update({
      where: { id: parseInt(id) },
      data: {
        before_weight,
        after_weight,
        barcode_weight: parseFloat(barcode_weight),
        updated_at: new Date(),
      },
    });

    res.status(200).json({ message: "Updated Successfully", updateProduct });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not Updated" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const delProduct = await prisma.product_info.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Deleted Successfully", delProduct });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not deleted" });
  }
};

const deleteAllProduct = async (req, res) => {
  try {
    const deleteAllProducts = await prisma.product_info.deleteMany();
    res
      .status(200)
      .json({ message: "Deleted Successfully", deleteAllProducts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Can't delete All Product" });
  }
};

module.exports = {
  getAllProducts,
  getProductByNumber,
  createNewProduct,
  UpdatingProduct,
  deleteProduct,
  deleteAllProduct,
  restoreProductByNumber,
};
