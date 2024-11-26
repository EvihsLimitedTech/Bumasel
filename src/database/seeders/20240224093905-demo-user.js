'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'user',
            [
                {
                    id: 1,
                    firstName: 'first',
                    lastName: 'user1',
                    email: 'user1@test.com',
                    role: 'admin',
                    phone: '07016000164',
                    password: 'tomatoes',
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    firstName: 'first',
                    lastName: 'user1',
                    email: 'user2@test.com',
                    password: 'lemonade',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    firstName: 'first',
                    lastName: 'user1',
                    email: 'user3@test.com',
                    password: 'sandwish',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
        {
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('testuser', null, {});
    },
};
