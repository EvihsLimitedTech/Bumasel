
module.exports = (sequelize , DataTypes) => {
    // Wishlist Model
    const Wishlist = sequelize.define("wishlist" , {
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
    Wishlist.associate =(model) => {
        Wishlist.belongsTo(model.user);
        Wishlist.hasMany(model.wishlist_item, {
            foreignKey: 'wishlistId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
    return Wishlist;
}