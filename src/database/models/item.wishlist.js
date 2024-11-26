
module.exports = (sequelize , DataTypes) => {
    // Wishlist Items Model
    const Item = sequelize.define("wishlist_item" , {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
    Item.associate = (model) => {
        Item.belongsTo(model.wishlist);
        Item.belongsTo(model.goods);
    }
    return Item;
}