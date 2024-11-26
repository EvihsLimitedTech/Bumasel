module.exports = (sequelize, DataTypes) => {
    const EdibleGoods = sequelize.define('edible_goods', {
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
            type: DataTypes.ENUM('food', 'beverage'),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: true,
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

    EdibleGoods.associate = (model) => {
        EdibleGoods.belongsTo(model.goods, {
            foreignKey: 'id', 
            targetKey: 'id',  
            as: 'goods',
        });

        EdibleGoods.belongsTo(model.store, {
            foreignKey: 'storeId',
            as: 'store',
        });
    };

    return EdibleGoods;
};
