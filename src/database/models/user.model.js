const { DataTypes } = require('sequelize');
const { UserRole } = require('../../interfaces/database.model.js/user');

module.exports = (sequelize, DataTypes) => {
    // User model
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,

            // remove empty spaces
            set(value) {
                if (value) this.setDataValue('first_name', value.trim().toLowerCase());
            },
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,

            // remove empty spaces
            set(value) {
                if (value) this.setDataValue('last_name', value.trim().toLowerCase());
            },
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.first_name} ${this.last_name}`;
            },
            set(value) {
                throw new Error('Do not try to set the `fullName` value!');
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
                notNull: {
                    msg: 'Please enter a valid Email address',
                },
            },
            allowNull: false,
            set(value) {
                if (value)
                    // remove whitespaces and convert to lowercase
                    this.setDataValue('email', value.trim().toLowerCase());
            },
        },
        role: {
            type: DataTypes.ENUM(['Admin', 'EndUser', 'Vendor']),
            defaultValue: 'EndUser',
            allowNull: false,
        },
        address: {
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
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age_range: {
            type: DataTypes.STRING,
            allowNull: false,
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
        is_activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        is_student: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        profile_image: { type: DataTypes.STRING(2000000), allowNull: true },
        unique_string: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp_expiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    //  =========== USER ASSOCIATIONS =========== //

    User.associate = (model) => {
        User.hasOne(model.password, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasOne(model.admin, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasOne(model.end_user, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasOne(model.vendor, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(model.reviews, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(model.goods, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasOne(model.wishlist, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return User;
};
