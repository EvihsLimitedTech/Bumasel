const { UserRole } = require('../../interfaces/database.model.js/user');

module.exports = (sequelize, DataTypes) => {
    // Vendor profile model
    const Vendor = sequelize.define('vendor', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(['Admin', 'Vendor', 'EndUser']),
            defaultValue: 'Vendor',
            allowNull: false,
            validate: {
                isIn: {
                    args: [Object.values(UserRole)],
                    msg: 'invalid Role input: Please select correct option',
                },
            },
        },
        phone: {
            type: DataTypes.BIGINT,
            unique: true,
            validate: {
                len: {
                    args: [10, 15],
                    msg: 'Phone number should be between 10 and 15 digits!',
                },
                isNumeric: {
                    msg: 'Please enter a valid numeric Phone number!',
                },
            },
        },
    });

    //  =========== VENDOR ASSOCIATIONS =========== //
    Vendor.associate = (model) => {
        Vendor.belongsTo(model.user);
        Vendor.hasMany(model.store, {
            foreignKey: 'vendorId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Vendor;
};
