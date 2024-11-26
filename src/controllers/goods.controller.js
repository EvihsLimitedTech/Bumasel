const db = require('../database/models/index.js');
const cloudinary = require('../utils/cloudinary.js');
const EdibleGoods = db.goods;
const SolidGoods = db.solid_goods;
const Store = db.store;
const Goods = db.goods;

class GoodsService {
    static async createProduct(productData) {
        try {
            let newProduct;
            if (productData.type === 'edible') {
                const edible = await EdibleGoods.create(productData);
                newProduct = await Goods.create({ ...productData, edibleGoodsId: edible.id });
            } else if (productData.type === 'solid') {
                const solid = await SolidGoods.create(productData);
                newProduct = await Goods.create({ ...productData, solidGoodsId: solid.id });
            } else {
                throw new Error('Invalid product type');
            }
            return newProduct;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    static async getAllProducts(req, res) {
        try {
            const filterType = req.query.type || null;
            const query = {};
            
            if (filterType) {
                query.where = { type: filterType };
            }
            
            const products = await Goods.findAll(query);
            
            // Send the products back as a JSON response
            return res.status(200).json({
                success: true,
                data: products
            });
        } catch (error) {
            // Handle the error and send it back in the response
            return res.status(500).json({
                success: false,
                message: 'Error retrieving products',
                error: error.message
            });
        }
    }

    static async getProducts(req, res) {
        try {
            const filterType = req.query.type || null;
            const page = parseInt(req.query.page) || 1; // Get the page from query, default is 1
            const limit = 10; // Number of products per page
            const offset = (page - 1) * limit; // Calculate the offset
    
            const query = {
                limit,
                offset,
            };
    
            if (filterType) {
                query.where = { type: filterType };
            }
    
            const { rows: products, count } = await Goods.findAndCountAll(query); // Get products with pagination
    
            return res.status(200).json({
                success: true,
                data: products,
                totalProducts: count,
                totalPages: Math.ceil(count / limit), // Total number of pages
                currentPage: page
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving products',
                error: error.message
            });
        }
    } 
    
    static async getProductById(req, res) {
        const { id } = req.params; // Extract 'id' from request parameters
    
        try {
            // Fetch the product by primary key (ID) without eager loading
            const product = await Goods.findByPk(id);
            console.log('Product fetched:', product);
    
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
    
            // If the product is found, return it as a JSON response
            return res.status(200).json({
                success: true,
                data: product,
            });
        } catch (error) {
            console.error('Error retrieving product:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving product',
                error: error.message,
            });
        }
    }        
    
    static async updateProduct(req, res) {
        const { productId, ...updatedData } = req.body; // Extract productId and updatedData from request body
    
        try {
            const product = await Goods.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
    
            // Update related records based on product type
            if (product.type === 'edible') {
                if (product.edibleGoodsId) {
                    await EdibleGoods.update(updatedData, { where: { id: product.edibleGoodsId } });
                }
            } else if (product.type === 'solid') {
                if (product.solidGoodsId) {
                    await SolidGoods.update(updatedData, { where: { id: product.solidGoodsId } });
                }
            }
    
            // Update the main Goods record
            const [updateCount, updatedProducts] = await Goods.update(updatedData, {
                where: { id: productId },
                returning: true,
            });
    
            if (updateCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No product updated',
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProducts[0],
            });
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating product',
                error: error.message,
            });
        }
    }
    
    static async deleteProduct(req, res) {
        const { productId } = req.body; // Extract productId from request body
    
        try {
            // Find the product by ID and include associated store
            const product = await Goods.findByPk(productId, {
                include: [
                    {
                        model: Store, // Include Store model to check ownership
                        as: 'store'
                    }
                ]
            });
    
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
    
            // Check if the user is the owner of the store
            // if (product.store.userId !== req.user.id) {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'Forbidden: You do not have permission to delete this product',
            //     });
            // }
    
            // Delete associated records based on the product type
            if (product.type === 'edible' && product.edibleGoodsId) {
                await EdibleGoods.destroy({ where: { id: product.edibleGoodsId } });
            } else if (product.type === 'solid' && product.solidGoodsId) {
                await SolidGoods.destroy({ where: { id: product.solidGoodsId } });
            }
    
            // Delete the product itself
            await Goods.destroy({
                where: { id: productId },
            });
    
            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting product',
                error: error.message,
            });
        }
    }
    
}

module.exports = GoodsService;
