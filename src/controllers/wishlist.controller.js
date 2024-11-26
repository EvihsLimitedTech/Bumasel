const db = require('../database/models/index')
const Wishlist = db.wishlist
const Item = db.wishlist_item



class WishlistController {
    static async AddToWishlist(req , res , next) {
        const userId = req.authPayload.user.id
        const {
            goodsId,
        } = req.data

        var wishlist = await Wishlist.findOne({where:{userId:{userId}}})
        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId:userId
            })
        }
        if(!wishlist) {
            throw new InternalServerError('wishlis creation error');
        }

        const item = await Item.create({
            wishlistId:wishlist.id,
            goosdId:goodsId,
        })

        if(!item) {
            res.status(200).json({
                status: 'failed',
                message: 'could not add item to wishlist',
                data:null,
            });
            return
        }
        res.status(201).json({
            status: 'success',
            message: 'item added to wishlist',
            data:item,
        });
    }
    static async GetWishlist(req , res , next) {
        const userId = req.authPayload.user.id
        var wishlist = await Wishlist.findOne({where:{userId:{userId}}})
        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId:userId
            })
        }

        const items = Item.findAll({
            where:{wishlistId:wishlist.id}
        })

        if(!items) {
            res.status(400).json({
                status: 'failed',
                message: 'wishlist not retrieved ',
                data:null,
            });
            return
        }

        res.status(200).json({
            status: 'success',
            message: 'whislist retrieved succcessfully ',
            data:items,
        });
    }
    static async RemoveItem(req , res , next) {
        if (req.params.id === "") {
            res.status(200).json({
                status: 'failed',
                message: 'item id not valid',
                data:null,
            });
            return
        }
        await Item.destroy({where:{id:req.params.id}})
        res.status(200).json({
            status: 'success',
            message: 'item successfully removed from wishlist',
            data:null,
        });
    }
}

module.exports = WishlistController;