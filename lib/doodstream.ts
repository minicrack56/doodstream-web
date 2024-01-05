import fetch from 'node-fetch'; // Assuming you are using Node.js

import {
    DEFAULT_PER_PAGE,
    DEFAULT_REVALIDATE_INTERVAL,
    DOODSTREAM_API_KEY,
    DOODSTREAM_BASE_URL,
} from "./constants";

type DoodstreamProps = {
    baseUrl?: string;
    key?: string;
};

class Doodstream {
    baseUrl: string;
    key: string;
    upstream: string | undefined;

    constructor(
        { baseUrl, key }: DoodstreamProps = {
            baseUrl: undefined,
            key: undefined,
        }
    ) {
        baseUrl = baseUrl || DOODSTREAM_BASE_URL;
        key = key || DOODSTREAM_API_KEY;

        if (!baseUrl) throw new Error("Doodstream Base URL not set");
        if (!key) throw new Error("Doodstream Key not set");

        this.baseUrl = baseUrl;
        this.key = key;
    }

    // ... (existing code)

    async getMoviePoster(movieTitle: string) {
        const apiKey = 'f49fd705543448a43b0f9969a906b96b';
        const tmdbBaseUrl = 'https://api.themoviedb.org/3';
        const searchUrl = `${tmdbBaseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const movie = data.results[0];
            if (movie.poster_path) {
                return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            }
        }

        return null; // Return null if no poster is found
    }
}

const doodstream = new Doodstream();

export default doodstream;
