// src/models/Movie.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Movie extends Model { }

Movie.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publishingYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        poster: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
    {
        sequelize,
        modelName: 'movie',
        timestamps: true, // Adding timestamps
        createdAt: 'createdAt', // Customizing createdAt column name
        updatedAt: 'updatedAt',
    }
);

export default Movie;
