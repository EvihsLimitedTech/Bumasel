const db = require('../database/models/index');
const User = db.user;
const Password = db.password;
const { UserRole } = require('../interfaces/database.model.js/user.js');
const { BadRequestError, InternalServerError } = require('../utils/error');
const { AuthTokenType, AuthorizationUtil } = require('../utils/token.js');
const Validator = require('../utils/validator');
const { createProfile } = require('../database/models/methods/profile.js');
const randString = require('../utils/random.string.js');
const { sendEmail, sendEmailOtp, sendPasswordResetEmail } = require('../services/email.service.js');
const path = require('path');
const { sequelize } = require('../database/models/index.js');
const { cloudinary } = require('../utils/cloudinary.js');

class AuthValidator {
    static async validateSignup({ email }) {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            throw new BadRequestError('Email is already registered');
        }
        return null;
    }

    static async validateLogin({ email, password }) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new BadRequestError('Incorrect email or password');
        }

        if (!user.is_activated) {
            throw new BadRequestError('Your account has not been activated');
        }

        const userPassword = await Password.findOne({ where: { userId: user.id } });
        if (!userPassword) {
            throw new BadRequestError('Invalid email or password');
        }

        const passwordMatch = await userPassword.comparePassword(password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid password');
        }

        return { user };
    }

    static async validateForgotPassword({ email, password }) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new BadRequestError('Incorrect email');
        }

        const validPassword = Validator.isPassword(password);
        if (!validPassword) {
            throw new BadRequestError('Invalid password');
        }

        return { user };
    }
}

class AuthController {
    static async login(req, res, next) {
        const { email, password } = req.body;
        const { user } = await AuthValidator.validateLogin({ email, password });

        if (!user.is_verified) {
            throw new BadRequestError('Your account has not been verified');
        }

        const accessToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Access,
            expiry: 3 * 60 * 60,
        });

        const refreshToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Refresh,
            expiry: 7 * 24 * 60 * 60,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
        });
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user,
                accessToken,
                // refreshToken,
            },
        });
    }

    static async signup(req, res) {
        const { firstName, lastName, email, password, phone, gender, ageRange, country, state, address } = req.body;

        const uniqueString = randString();
        const t = await sequelize.transaction(); // Start a transaction

        try {
            // Validate user data
            await AuthValidator.validateSignup(
                { firstName, lastName, email, password, phone, gender, ageRange, country, state, address },
                { transaction: t },
            );

            // Create new user
            const newUser = await User.create(
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    unique_string: uniqueString,
                    country: country,
                    state: state,
                    address: address,
                    gender: gender,
                    age_range: ageRange,
                },
                { transaction: t },
            );

            // Create user profile
            await createProfile(newUser.dataValues, t);

            // Create user password
            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            // If everything is successful, commit the transaction
            await t.commit();

            // Send verification email
            sendEmail(email, uniqueString);

            res.status(201).json({
                status: 'success',
                message: 'Signup successful',
                data: { user: newUser.dataValues },
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await t.rollback();
            console.error(error); // Log the error for debugging
            res.status(500).json({
                status: 'error',
                message: 'Signup failed',
                error: error.message,
            });
        }
    }
  
    static async signupWithOtp(req, res) {
        const { firstName, lastName, email, password, phone, gender, ageRange, country, state, address } = req.body;

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Set OTP expiry (e.g., 10 minutes)
        const otp_expiry = Date.now() + 10 * 60 * 1000;

        const t = await sequelize.transaction(); // Start a transaction

        try {
            // Validate user data
            await AuthValidator.validateSignup(
                { firstName, lastName, email, password, phone, gender, ageRange, country, state, address },
                { transaction: t },
            );

            // Create new user
            const newUser = await User.create(
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    country: country,
                    state: state,
                    address: address,
                    gender: gender,
                    age_range: ageRange,
                },
                { transaction: t },
            );

            // Create user profile
            await createProfile(newUser.dataValues, t);

            // Create user password
            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            await newUser.update(
                {
                    otp: otp,
                    otp_expiry: otp_expiry,
                },
                { transaction: t },
            );

            // If everything is successful, commit the transaction
            await t.commit();

            // Store the OTP and expiry in the user record

            // Send verification email
            sendEmailOtp(email, otp);

            res.status(201).json({
                status: 'success',
                message: 'Signup successful',
                data: { user: newUser.dataValues },
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await t.rollback();
            console.error(error); // Log the error for debugging
            res.status(500).json({
                status: 'error',
                message: 'Signup failed',
                error: error.message,
            });
        }
    }

    static async verifyEmail(req, res, next) {
        const { uniqueString, email } = req.query;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        if (user.unique_string === uniqueString) {
            await User.update(
                { is_verified: true },
                {
                    where: {
                        email: email,
                    },
                },
            );

            return res.sendFile(path.join(__dirname + '../../views/successful.email.verification.html'));
        } else {
            res.json('failed');
        }
    }

    static async verifyEmailOtp(req, res) {
        const { otp, email } = req.body;
        if (!otp || !email) {
            throw new BadRequestError('Missing required parameters');
        }

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otp_expiry) {
            throw new BadRequestError('Expired OTP');
        }

        await User.update(
            { is_verified: true },
            {
                where: {
                    email: email,
                },
            },
        );

        return res.status(200).json({ status: 'success', message: 'Otp verified successfully' });
    }

    static async logout(req, res, next) {
        const user = await User.findOne({ where: { id: req.authPayload.user.id } });

        if (!user) {
            throw new InternalServerError('User record not found for authenticated request');
        }

        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Access,
        });

        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Refresh,
        });

        res.status(200).json({ status: 'success', message: 'Logout successful', data: null });
    }

    static async refreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne({ where: { id: req.authPayload.user.id } });

        if (!user) {
            throw new InternalServerError('User record not found for authenticated request');
        }

        await AuthorizationUtil.verifyToken({
            user,
            token: refreshToken,
            tokenType: AuthTokenType.Refresh,
        });

        const accessToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Access,
            expiry: 3 * 60 * 60,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: { user, accessToken },
        });
    }

    static async updatePassword(req, res, next) {
        const { email, currentPassword, newPassword } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new InternalServerError('User record not found');
        }

        const userPassword = await Password.findOne({ where: { userId: user.id } });

        if (!userPassword) {
            throw new BadRequestError('User password record not found');
        }

        const passwordMatch = await userPassword.comparePassword(currentPassword);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid current password');
        }

        await Password.update(
            { password: newPassword },
            {
                where: {
                    userId: user.id,
                },
                individualHooks: true,
            },
        );

        res.status(200).json({
            status: 'success',
            message: 'Password update successful',
            data: user,
        });
    }


    static async updateUserProfile(req, res) {
        const { firstName, lastName, gender, email, phone, country, state, city, address, ageRange } = req.body;
        const profilePicture = req.file; // Get the uploaded file
    
        // Check if email is provided
        if (!email) {
            throw new BadRequestError('Email is required');
        }
    
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }
    
        // Update user profile
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            gender: gender || user.gender,
            phone: phone || user.phone,
            country: country || user.country,
            state: state || user.state,
            city: city || user.city,
            address: address || user.address,
            ageRange: ageRange || user.ageRange,
            profilePicture: profilePicture ? profilePicture.path : user.profilePicture
        });
    
        res.status(200).json({
            status: 'success',
            message: 'User profile updated successfully',
            data: {
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    phone: user.phone,
                    country: user.country,
                    state: user.state,
                    city: user.city,
                    address: user.address,
                    ageRange: user.ageRange,
                    profilePicture: user.profilePicture
                }
            }
        });
    }

    static async resetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            throw new BadRequestError('Invalid email');
        }
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Set OTP expiry (e.g., 10 minutes)
        const otp_expiry = Date.now() + 10 * 60 * 1000;

        // Store the OTP and expiry in the user record
        await user.update({
            otp: otp,
            otp_expiry: otp_expiry,
        });

        sendPasswordResetEmail(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Otp sent successfully',
            data: user,
        });
    }

    static async verifyEmailOtp(req, res) {
        const { otp, email } = req.body;
        if (!otp || !email) {
            throw new BadRequestError('Missing required parameters');
        }

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otp_expiry) {
            throw new BadRequestError('Expired OTP');
        }

        await User.update(
            { is_verified: true },
            {
                where: {
                    email: email,
                },
            },
        );

        return res.status(200).json({ status: 'success', message: 'Otp verified successfully' });
    }

    static async resetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            throw new BadRequestError('Invalid email');
        }
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Set OTP expiry (e.g., 10 minutes)
        const otp_expiry = Date.now() + 10 * 60 * 1000;

        // Store the OTP and expiry in the user record
        await user.update({
            otp: otp,
            otp_expiry: otp_expiry,
        });

        sendPasswordResetEmail(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Otp sent successfully',
            data: user,
        });
    }

    static async verifyResetOtp(req, res) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new BadRequestError('Missing required parameters');
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otp_expiry) {
            throw new BadRequestError('Expired OTP');
        }

        await User.update(
            { is_verified: true },
            {
                where: {
                    email: email,
                },
            },
        );

        return res.status(200).json({ status: 'success', message: 'Otp verified successfully' });
    }

    static async resetPasswordComplete(req, res) {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            throw new BadRequestError('Missing required parameters');
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otp_expiry) {
            throw new BadRequestError('Expired OTP');
        }

        await Password.update(
            { password: password },
            {
                where: {
                    userId: user.id,
                },
                individualHooks: true,
            },
        );

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully',
        });
    }

    static async resendOtp(req, res) {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            throw new BadRequestError('Email is required');
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP was recently sent (e.g., within the last 2 minutes)
        const otpCooldown = 2 * 60 * 1000; // 2 minutes
        const now = Date.now();
        if (user.otp_expiry && now < user.otp_expiry - 10 * 60 * 1000 + otpCooldown) {
            return res.status(429).json({
                status: 'fail',
                message: `Please wait before requesting a new OTP.`,
            });
        }

        // Generate a new OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set the new OTP expiry (e.g., 10 minutes from now)
        const otp_expiry = now + 10 * 60 * 1000;

        // Update user record with new OTP and expiry
        await user.update({
            otp,
            otp_expiry,
        });

        // Resend the OTP via email (or SMS)
        sendEmailOtp(user.email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Otp resent successfully',
        });
    }
}

module.exports = AuthController;
