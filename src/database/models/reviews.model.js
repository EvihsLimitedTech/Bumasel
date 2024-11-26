const db = require('./index');

module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('reviews', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(['vendor', 'goods', 'service']),
            allowNull: false,
        },
        sender_name: {
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        sender_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        goods_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    });

    // ============ REVIEW ASSOCIATIONS ============//

    Reviews.associate = (model) => {
        Reviews.belongsTo(model.vendor);

        Reviews.belongsTo(model.goods, {
            foreignKey: 'goods_id',
            as: 'goods',
        });
    };

    return Reviews;
};
