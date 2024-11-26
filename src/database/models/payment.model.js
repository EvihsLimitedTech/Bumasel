module.exports = (sequelize, DataTypes) => {
    // Payment model
    const Payment = sequelize.define('payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gateway: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extra: {
            type: DataTypes.JSON,
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

    // ============ PAYMENT ASSOCIATIONS ============//
    Payment.associate = (model) => {
        Payment.belongsTo(model.transaction);
    };

    return Payment;
};
