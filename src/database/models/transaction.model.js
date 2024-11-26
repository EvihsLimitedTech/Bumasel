module.exports = (sequelize , DataTypes) => {
    // Payment transaction model
    const Transaction = sequelize.define("transaction" , {
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
        amount:{
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
          },        
        code: {
            type: DataTypes.STRING,
            allowNull: false,
          },        
        reference: {
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

    //  =========== Transaction ASSOCIATIONS =========== //
    Transaction.associate = (model) => {
        Transaction.belongsTo(model.store);
        Transaction.belongsTo(model.subscription);
        Transaction.hasOne(model.payment , {
            foreignKey: 'transactionid',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Transaction;
}