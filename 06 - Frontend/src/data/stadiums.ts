// Stadium locations and metadata for Google Maps integration
export interface Stadium {
  name: string;
  city: string;
  country: string;
  capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
}

export const STADIUMS: Record<string, Stadium> = {
  "Old Trafford": {
    name: "Old Trafford",
    city: "Manchester",
    country: "England",
    capacity: 74879,
    coordinates: { lat: 53.4631, lng: -2.2914 },
    address: "Sir Matt Busby Way, Old Trafford, Stretford, Manchester M16 0RA, UK"
  },
  "Santiago Bernabéu": {
    name: "Santiago Bernabéu",
    city: "Madrid",
    country: "Spain",
    capacity: 81044,
    coordinates: { lat: 40.4530, lng: -3.6883 },
    address: "Av. de Concha Espina, 1, 28036 Madrid, Spain"
  },
  "Allianz Arena": {
    name: "Allianz Arena",
    city: "Munich",
    country: "Germany",
    capacity: 75000,
    coordinates: { lat: 48.2188, lng: 11.6242 },
    address: "Werner-Heisenberg-Allee 25, 80939 München, Germany"
  },
  "Camp Nou": {
    name: "Camp Nou",
    city: "Barcelona",
    country: "Spain",
    capacity: 99354,
    coordinates: { lat: 41.3809, lng: 2.1228 },
    address: "C. d'Arístides Maillol, 12, 08028 Barcelona, Spain"
  },
  "Anfield": {
    name: "Anfield",
    city: "Liverpool",
    country: "England",
    capacity: 53394,
    coordinates: { lat: 53.4308, lng: -2.9609 },
    address: "Anfield Rd, Anfield, Liverpool L4 0TH, UK"
  },
  "Parc des Princes": {
    name: "Parc des Princes",
    city: "Paris",
    country: "France",
    capacity: 47929,
    coordinates: { lat: 48.8414, lng: 2.2531 },
    address: "24 Rue du Commandant Guilbaud, 75016 Paris, France"
  },
  "Allianz Stadium": {
    name: "Allianz Stadium",
    city: "Turin",
    country: "Italy",
    capacity: 41507,
    coordinates: { lat: 45.1097, lng: 7.6410 },
    address: "Corso Gaetano Scirea, 50, 10151 Torino TO, Italy"
  },
  "Emirates Stadium": {
    name: "Emirates Stadium",
    city: "London",
    country: "England",
    capacity: 60260,
    coordinates: { lat: 51.5086, lng: -0.1015 },
    address: "Hornsey Rd, London N7 7AJ, UK"
  },
  "Stamford Bridge": {
    name: "Stamford Bridge",
    city: "London",
    country: "England",
    capacity: 40834,
    coordinates: { lat: 51.4816, lng: -0.1909 },
    address: "Fulham Rd, Fulham, London SW6 1HS, UK"
  },
  "Etihad Stadium": {
    name: "Etihad Stadium",
    city: "Manchester",
    country: "England",
    capacity: 55017,
    coordinates: { lat: 53.4831, lng: -2.2004 },
    address: "Ashton New Rd, Manchester M11 3FF, UK"
  }
};

export const getStadiumInfo = (venueName: string): Stadium | null => {
  return STADIUMS[venueName] || null;
};

export const getStadiumNames = (): string[] => {
  return Object.keys(STADIUMS);
};