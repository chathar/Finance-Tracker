const sequelize = require('./config/database');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced. Seeding data...');

        // Create Sample Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123'
        });

        const user = await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'user123'
        });

        console.log('Users created:');
        console.log('- Admin: admin@example.com / admin123');
        console.log('- User: user@example.com / user123');

        // Create Sample Categories for Admin
        const categories = [
            { name: 'Food', type: 'expense', userId: admin.id },
            { name: 'Transport', type: 'expense', userId: admin.id },
            { name: 'Salary', type: 'income', userId: admin.id },
            { name: 'Rent', type: 'expense', userId: admin.id },
            { name: 'Entertainment', type: 'expense', userId: admin.id },
            { name: 'Freelance', type: 'income', userId: admin.id }
        ];
        await Category.bulkCreate(categories);

        // Create Sample Transactions for Admin
        const transactions = [
            {
                userId: admin.id,
                type: 'income',
                amount: 5000,
                category: 'Salary',
                description: 'Monthly salary',
                date: new Date('2026-03-01')
            },
            {
                userId: admin.id,
                type: 'expense',
                amount: 1500,
                category: 'Rent',
                description: 'March rent',
                date: new Date('2026-03-02')
            },
            {
                userId: admin.id,
                type: 'expense',
                amount: 50,
                category: 'Food',
                description: 'Lunch with team',
                date: new Date('2026-03-03')
            },
            {
                userId: admin.id,
                type: 'expense',
                amount: 100,
                category: 'Entertainment',
                description: 'Movie night',
                date: new Date('2026-03-04')
            },
            {
                userId: admin.id,
                type: 'income',
                amount: 800,
                category: 'Freelance',
                description: 'Logo design project',
                date: new Date('2026-03-05')
            }
        ];
        await Transaction.bulkCreate(transactions);

        console.log('Sample transactions and categories seeded.');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
