export interface Country {
    cca2: string;
    flags: { svg: string };
    name: {
        common: string;
        nativeName?: { [key: string]: { official: string; common: string } };
    };
    population: number;
    region: string;
    subregion?: string;
    capital: string[];
    tld?: string[];
    currencies?: { [key: string]: { name: string; symbol: string } };
    languages?: { [key: string]: string };
    borders?: string[];
}

export interface CountryDetail extends Country {
    // Additional fields that might be needed for detail view
    area?: number;
    timezones?: string[];
    continents?: string[];
}