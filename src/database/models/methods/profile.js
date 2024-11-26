const db = require('../index');
const EndUser = db.end_user;
const Admin = db.admin;
const Vendor = db.vendor;

async function getProfile(user) {
    let userProfile = null;
    if (user.role === 'Admin') {
        userProfile = await Admin.findOne({ where: { userId: user.id } });
    } else if (user.role === 'EndUser') {
        userProfile = await EndUser.findOne({ where: { userId: user.id } });
    } else if (user.role === 'Vendor') {
        userProfile = await Vendor.findOne({ where: { userId: user.id } });
    } else {
        throw new Error('Invalid user role');
    }
    if (!userProfile) {
        throw new Error('User profile not found');
    }
    return userProfile;
}

async function createProfile(user, transaction) {
    if (!transaction) {
        throw new Error('Transaction not provided');
    }

    if (user.role === 'Vendor') {
        await Vendor.create(
            {
                userId: user.id,
                role: user.role,
            },
            { transaction },
        );
    } else if (user.role === 'Admin') {
        await Admin.create(
            {
                userId: user.id,
                role: user.role,
            },
            { transaction },
        );
    } else if (user.role === 'EndUser') {
        await EndUser.create(
            {
                userId: user.id,
                role: user.role,
            },
            { transaction },
        );
    } else {
        throw new Error('Invalid user role');
    }
}

module.exports = {
    getProfile,
    createProfile,
};
