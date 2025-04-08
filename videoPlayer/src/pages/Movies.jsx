import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from "../components/organisms/Header";
import moviesData from '../data/data';

function Movies() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    const movies = moviesData
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePlayMovie = (movie) => {
        navigate(`../play/${movie.id}`, { state: { movie } });
        console.log(movie);
     };

    const genres = [...new Set(movies.flatMap(movie => {
        if (movie.genre) {
            return movie.genre.split(', ');
        } else {
            console.error("movie.genre es undefined");
            return [];
        }
    }))];

    return (
        <div 
            style={{ 
                backgroundImage: 'url("wallpaperMiko.jpg")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }} 
            className="min-h-screen text-white"
        >
            <HeaderComponent />
            
            <main className="container mx-auto px-4 pt-24 pb-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Series</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="bg-gray-900 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="mb-8">
                    <img src="espacio.jpg" alt="Espacio" className="w-full h-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredMovies.map(movie => (
                        <div 
                            key={movie.id}
                            className="group cursor-pointer"
                            onClick={() => handlePlayMovie(movie)}
                        >
                            <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                <div className="relative aspect-[3/4]">
                                    <img 
                                        src={movie.imageUrl} 
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <button className="bg-transparent text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-8 w-8" 
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 3l14 9-14 9V3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 truncate">{movie.title}</h3>
                                    <div className="mt-2 text-xs text-gray-500 truncate">
                                        {movie.genre}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No se encontraron películas que coincidan con tu búsqueda.</p>
                    </div>
                )}

                
            </main>
        </div>
    );
}

export default Movies;