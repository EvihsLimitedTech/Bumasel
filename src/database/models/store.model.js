
module.exports = (sequelize , DataTypes) => {
    const Store = sequelize.define("store" , {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name:{
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        slug:{
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        institution: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },

    });

    // ============ STORE ASSOCIATIONS ============//
    Store.associate = (model) => {
        Store.belongsTo(model.vendor);
        Store.hasOne(model.transaction , {
            foreignKey: 'storeid',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Store.hasOne(model.storetype, {
            foreignKey: 'storetypeId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }

    return Store;
}