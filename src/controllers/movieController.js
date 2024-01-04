
import { validate } from 'uuid';
import Movie from '../models/Movie.js'; // Import the Movie model

import * as yup from 'yup';

const notFutureYear = (value) => {
    const currentYear = new Date().getFullYear();
    return value <= currentYear;
};

const createMovieSchema = yup.object().shape({
    title: yup.string().required(),
    publishingYear: yup.number().integer().max(new Date().getFullYear(), 'Publishing year cannot be in the future').required(),
    poster: yup.string().typeError('Poster must be a text').required(),
});

// Create a new movie
const createMovie = async (req, res) => {
    const { title, publishingYear, poster } = req.body;

    try {
        await createMovieSchema.validate({
            title,
            publishingYear,
            poster,
        }, { abortEarly: false });

        const movie = await Movie.findOne({
            where: {
                title: title
            }
        })

        if (movie && movie.title == title) {
            return res.status(409).json({
                msg: "Movie with the same name already exists"
            });
        }
        const newMovie = await Movie.create({
            title,
            publishingYear,
            poster,
            userId: req?.user?.id || ""
        });

        res.status(201).json(newMovie);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = error.errors.map(err => err);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: 'Failed to create movie', error: error.message });
    }
};


const getAllMoviesSchema = yup.object().shape({
    page: yup.number().positive().integer().default(1),
});

// Fetch all movies
const getAllMovies = async (req, res) => {
    try {
        const { page = 1 } = req?.query;
        const validatedPage = await getAllMoviesSchema.validate({ page });
        const limit = 10;
        let offset = 0;
        offset = limit * (validatedPage.page - 1);
        const count = await Movie.count({
            where: {
                userId: req?.user?.id
            }
        });
        const movies = await Movie.findAll({
            where: {
                userId: req?.user?.id
            },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        const pages = Math.ceil(count / limit)
        res.send({
            movies,
            count,
            pages
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = error.errors.map(err => err);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        console.log(error)
        res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
    }
};


const updateMovieSchema = yup.object().shape({
    title: yup.string(),
    publishingYear: yup.number().integer().max(new Date().getFullYear(), 'Publishing year cannot be in the future'),
    poster: yup.string(),
    movieId: yup.string().uuid().required(),

});

const updateMovie = async (req, res) => {
    const { title, publishingYear, poster } = req.body;
    const { movieId } = req?.params
    try {
        await updateMovieSchema.validate({
            title,
            publishingYear,
            poster,
            movieId,
        });

        const movieToUpdate = await Movie.findByPk(movieId);

        if (!movieToUpdate) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        await movieToUpdate.update({
            title,
            publishingYear,
            poster,
        });

        res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = error.errors.map(err => err);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        console.error(error)
        res.status(500).json({ message: 'Failed to update movie', error: error.message });
    }
}

export { createMovie, getAllMovies, updateMovie };
