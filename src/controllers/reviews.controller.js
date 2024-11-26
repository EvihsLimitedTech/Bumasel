const db = require('../database/models/index.js');
const Goods = db.goods;
const Review = db.reviews; // Ensure this matches the defined model name

class ReviewController {
    // Method to create a review
    static async createReview(req, res) {
        const { comment, type, sender_name, sender_id, goods_id } = req.body;

        try {
            // Ensure the associated goods exists
            const goods = await Goods.findByPk(goods_id);
            if (!goods) {
                return res.status(404).json({ status: "Error", message: 'Goods not found' });
            }

            // Create the review
            const review = await Review.create({ 
                comment,
                type,
                sender_name,
                sender_id,
                goods_id 
            });

            res.status(201).json({ status: "Success", message: 'Review created successfully' });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ status: "Error", message: 'An error occurred while creating the review', error });
        }
    }

    // Method to get reviews
    static async getReviews(req, res) {
        const { goods_id } = req.params;

        try {
            // Ensure the associated Goods exists
            const goods = await Goods.findByPk(goods_id);
            if (!goods) {
                return res.status(404).json({ status: "Error", message: 'Goods not found' });
            }

            // Get all reviews for the product
            const reviews = await Review.findAll({ // Use Review model
                where: { goods_id: goods.id },
                include: [{
                    model: Goods,
                    as: 'goods'  // This should match the alias used in Reviews.belongsTo
                }],
            });

            res.status(200).json({ status: "Success", message: "Reviews Available", reviews });
        } catch (error) {
            console.error('Error retrieving reviews:', error);
            res.status(500).json({ status:"Error", message: 'An error occurred while retrieving the reviews', error });
        }
    }
}

module.exports = ReviewController;
