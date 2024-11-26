module.exports = (sequelize, DataTypes) => {
    const SolidGoods = sequelize.define('solid_goods', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
            type: DataTypes.JSONB,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        colors: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        sizes: {
            type: DataTypes.JSONB,
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

    SolidGoods.associate = (model) => {
        SolidGoods.belongsTo(model.goods, {
            foreignKey: 'goodsId',
            as: 'goods',
        });

        SolidGoods.belongsTo(model.store, {
            foreignKey: 'storeId',
            as: 'store',
        });
    };

    return SolidGoods;
};
