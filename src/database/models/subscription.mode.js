
module.exports = (sequelize , DataTypes) => {
    // Payment plan Subscriptions
    const Subscription = sequelize.define("subscription" , {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        interval: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount:{
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
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
    })

    //  =========== Subscription ASSOCIATIONS =========== //
    Subscription.associate = (model) => {
        Subscription.belongsTo(model.storetype);
        Subscription.hasOne(model.transaction, {
            foreignKey: 'subscriptionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        
    };

    return Subscription
}