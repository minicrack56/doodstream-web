class Doodstream {
    baseUrl: string;
    key: string;
    tmdbApiKey: string;

    constructor(
        { baseUrl, key, tmdbApiKey }: DoodstreamProps = {
            baseUrl: undefined,
            key: undefined,
            tmdbApiKey: "f49fd705543448a43b0f9969a906b96b", // Default TMDB API key
        }
    ) {
        baseUrl = baseUrl || DOODSTREAM_BASE_URL;
        key = key || DOODSTREAM_API_KEY;

        if (!baseUrl) throw new Error("Doodstream Base URL not set");
        if (!key) throw new Error("Doodstream Key not set");

        this.baseUrl = baseUrl;
        this.key = key;
        this.tmdbApiKey = tmdbApiKey;
    }

    // ... (other methods)

    async getMovieDetails({ movieId }: { movieId: string }) {
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.tmdbApiKey}`;
        const response = await fetch(tmdbUrl);
        return await response.json();
    }

    async listFiles({
        page = 1,
        per_page = DEFAULT_PER_PAGE,
        fld_id = "",
    }: {
        page?: number;
        per_page?: number;
        fld_id?: string;
    }) {
        if (per_page && per_page > 200)
            throw new Error("per_page cannot be greater than 200");

        const data = await this.fetch(
            "/file/list",
            {
                page: page.toString(),
                per_page: per_page.toString(),
                fld_id: fld_id.toString(),
            },
            60
        );

        const files = data.result.files;
        const filesWithCovers = await Promise.all(
            files.map(async (file: any) => {
                const movieDetails = await this.getMovieDetails({ movieId: file.tmdb_id });
                const coverImageUrl = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
                return {
                    ...file,
                    coverImageUrl,
                };
            })
        );

        return filesWithCovers;
    }

    // ... (other methods)
}

const doodstream = new Doodstream();

export default doodstream;
