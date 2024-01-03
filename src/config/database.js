import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
 
const { POSTGRES_URL } = process.env;
 
export const sequelize = new Sequelize(POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
        // Add any additional options here if needed
        // For example, to enable pgbouncer and set a connection timeout
        options: {
            pgbouncer: true,
            connectTimeout: 15000,
        },
    },
});
 
// Test the connection
sequelize
    .authenticate()
    .then(async () => {
        console.log('Database connected!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
 
export default sequelize;
 