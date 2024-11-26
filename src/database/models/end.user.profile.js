const { UserRole } = require('../../interfaces/database.model.js/user');
const db = require('./index');

module.exports = (sequelize, DataTypes) => {
    // EndUser profile model
    const EndUser = sequelize.define('end_user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(['Admin', 'Vendor', 'EndUser']),
            defaultValue: 'EndUser',
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

    //  =========== END USER ASSOCIATIONS =========== //
    EndUser.associate = (model) => {
        EndUser.belongsTo(model.user);
    };

    return EndUser;
};
