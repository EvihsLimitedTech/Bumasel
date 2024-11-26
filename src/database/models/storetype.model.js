
module.exports = (sequelize, DataTypes) => {
    const StoreType = sequelize.define('storetype', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        tite: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
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

    //  =========== StoreType ASSOCIATIONS =========== //
    StoreType.associate = (model) => {
        StoreType.hasOne(model.subscription, {
            foreignKey: 'subscriptionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        StoreType.belongsTo(model.store);
    };

    return StoreType;
};
