module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(['typea', 'typeb', 'typec']),
            allowNull: false,
        },
    });

    // ============ SERVICE ASSOCIATIONS ============//

    Service.associate = (model) => {
        Service.belongsTo(model.vendor);
    };

    return Service;
};
