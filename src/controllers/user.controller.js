const db = require('../database/models/index');
const User = db.user;
const Password = db.password;
const { sequelize } = require('../database/models/index.js');

class UserController {
    // Method to create a new user
    static async createUser(req, res) {
        const t = await sequelize.transaction();

        try {
            const {
                firstName,
                lastName,
                email,
                role,
                address,
                country,
                state,
                gender,
                ageRange,
                phone,
                profileImage,
                isStudent,
                isVerified,
                password,
            } = req.body;

            const newUser = await User.create(
                {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    role,
                    address,
                    country,
                    state,
                    gender,
                    age_range: ageRange,
                    phone,
                    profile_image: profileImage,
                    is_student: isStudent,
                    is_verified: isVerified,
                },
                { transaction: t },
            );

            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            await t.commit();

            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                data: { user: newUser },
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    static async updateUser(req, res) {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            role,
            address,
            country,
            state,
            gender,
            ageRange,
            phone,
            isStudent,
            profileImage,
        } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        let updates = {};

        if (firstName) {
            updates.first_name = firstName;
        }
        if (lastName) {
            updates.last_name = lastName;
        }
        if (email) {
            updates.email = email;
        }
        if (role) {
            updates.role = role;
        }
        if (address) {
            updates.address = address;
        }
        if (country) {
            updates.country = country;
        }
        if (state) {
            updates.state = state;
        }
        if (gender) {
            updates.gender = gender;
        }
        if (ageRange) {
            updates.age_range = ageRange;
        }
        if (phone) {
            updates.phone = phone;
        }
        if (isStudent) {
            updates.is_student = isStudent;
        }
        if (profileImage) {
            updates.profile_image = profileImage;
        }
        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        // Update user with provided data
        await user.update(updates);

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            sata: user,
        });
    }

    static async deleteUser(req, res) {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    }

    static async getAllUsers(req, res) {
        const users = await User.findAll();
        res.status(200).json({ status: 'success', data: users });
    }

    static async getUserById(req, res) {
        const { id } = req.params;

        const user = await User.findOne({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
}

module.exports = UserController;
