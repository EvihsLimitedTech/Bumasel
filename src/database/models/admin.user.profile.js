const { UserRole } = require('../../interfaces/database.model.js/user');
const db = require('./index');

module.exports = (sequelize, DataTypes) => {
    // Admin profile model
    const Admin = sequelize.define('admin', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(['SuperAdmin', 'Admin', 'EndUser']),
            defaultValue: 'EndUser',
            allowNull: false,
            validate: {
                isIn: {
                    args: [Object.values(UserRole)],
                    msg: 'invalid Role input: Please select correct option',
                },
            },
        },
    });

    //  =========== ADMIN ASSOCIATIONS =========== //

    Admin.associate = (model) => {
        Admin.belongsTo(model.user);
    };

    return Admin;
};
