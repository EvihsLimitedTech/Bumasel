module.exports = (sequelize, DataTypes) => {
    const Goods = sequelize.define('goods', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('edible', 'solid'),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        brand: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        image1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image3: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image4: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Goods.associate = (model) => {
        Goods.hasOne(model.edible_goods, {
            foreignKey: 'id',
            as: 'edibleGoods',
        });

        Goods.hasOne(model.solid_goods, {
            foreignKey: 'id',
            as: 'solidGoods',
        });

        Goods.belongsTo(model.store, {
            foreignKey: 'storeId',
            as: 'store',
        });

        Goods.hasMany(model.reviews, {
            foreignKey: 'goods_id',
            as: 'reviews',
        });
        Goods.hasMany(model.wishlist_item, {
            foreignKey: 'goodsId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Goods;
};
