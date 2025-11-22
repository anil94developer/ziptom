import axios from "axios";
import { getCurrentLocation } from "./permissionHelper";
import { MAPKEY } from "@env";

export const getAddressFromCoordinates = async (latitude?: number, longitude?: number) => {
    let lat = latitude;
    let lng = longitude;

    // If coordinates not provided, get current location
    if (!lat || !lng) {
        const res = await getCurrentLocation();
        if (!res) {
            return null;
        }
        lat = res.latitude;
        lng = res.longitude;
    }

    console.log("current lat long =====", { latitude: lat, longitude: lng });
    
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPKEY}`;
        console.log(url);
        const response = await axios.get(url);

        if (response.data.status === "OK") {
            return response.data.results[0].formatted_address;
        } else {
            return "No address found";
        }
    } catch (error) {
        console.log("Reverse Geocoding Error:", error);
        return null;
    }
};

// Google Places Autocomplete API
export interface PlacePrediction {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export interface PlaceDetails {
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    name?: string;
    place_id: string;
}

export const searchPlacesAutocomplete = async (query: string, location?: { lat: number; lng: number }): Promise<PlacePrediction[]> => {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${MAPKEY}`;
        
        // Add location bias if available
        if (location) {
            url += `&location=${location.lat},${location.lng}&radius=50000`;
        }
        
        const response = await axios.get(url);
        
        if (response.data.status === "OK" || response.data.status === "ZERO_RESULTS") {
            return response.data.predictions || [];
        } else {
            console.log("Places API Error:", response.data.status);
            return [];
        }
    } catch (error) {
        console.log("Places Autocomplete Error:", error);
        return [];
    }
};

export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,name,place_id&key=${MAPKEY}`;
        const response = await axios.get(url);
        
        if (response.data.status === "OK") {
            return response.data.result;
        } else {
            console.log("Place Details Error:", response.data.status);
            return null;
        }
    } catch (error) {
        console.log("Place Details Error:", error);
        return null;
    }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param distanceInKm - Distance in kilometers
 * @returns Formatted distance string (e.g., "2.5 Km" or "500 m")
 */
export const formatDistance = (distanceInKm: number): string => {
    if (distanceInKm < 1) {
        // Show in meters if less than 1 km
        const meters = Math.round(distanceInKm * 1000);
        return `${meters} m`;
    } else {
        // Show in kilometers with 1 decimal place
        return `${distanceInKm.toFixed(1)} Km`;
    }
};


