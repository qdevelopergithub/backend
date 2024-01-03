
import Movie from '../models/Movie.js'; // Import the Movie model

// Create a new movie
const createMovie = async (req, res) => {
    const { title, publishingYear, poster } = req.body;

    try {

        const newMovie = await Movie.create({
            title,
            publishingYear,
            poster,
        });

        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create movie', error: error.message });
    }
}; ``

// Fetch all movies
const getAllMovies = async (req, res) => {
    const { page = 1 } = req?.query;
    const limit = 20;
    let offset = 0;
    offset = limit * (page - 1);
    try {

        const movies = await Movie.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
    }
};

const updateMovie = async (req, res) => {
    const { title, publishingYear, poster } = req.body;
    const { movieId } = req?.params
    try {

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
        console.error(error)
        res.status(500).json({ message: 'Failed to update movie', error: error.message });
    }
}

export { createMovie, getAllMovies, updateMovie };
