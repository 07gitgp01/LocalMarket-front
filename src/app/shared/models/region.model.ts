/**
 * Interface représentant une région géographique
 */
export interface Region {
    id: number;
    name: string;
    capital: string;
    population: number;
    area: number; // km²
    provinces: string[];
    image?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
