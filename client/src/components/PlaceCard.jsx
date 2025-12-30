import React from 'react';

const PlaceCard = ({ place }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={place.image}
                alt={place.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{place.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {place.category}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 italic">{place.location}</p>
                <p className="text-gray-600 text-sm line-clamp-3 my-3">
                    {place.description}
                </p>

                {/* Future: Add 'View Details' or 'Add to Plan' buttons here */}
                {/* 
                <button className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 transition-colors">
                    Explore
                </button> 
                */}
            </div>
        </div>
    );
};

export default PlaceCard;
