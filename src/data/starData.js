// Star data with coordinates and detailed information
// Coordinates are relative to the full image dimensions (42208x9870 for Andromeda)

export const starData = {
  'andromeda-fallback': [
    {
      id: 'star-1',
      name: 'HD 9826',
      x: 15000, // X coordinate on the full image
      y: 3000,  // Y coordinate on the full image
      type: 'Red Giant',
      magnitude: 4.2,
      distance: '2.5 million light-years',
      temperature: '3,800 K',
      mass: '1.8 solar masses',
      description: 'A prominent red giant star in the Andromeda Galaxy. This star has evolved beyond the main sequence and expanded significantly, giving it its characteristic reddish color.',
      constellation: 'Andromeda',
      spectralClass: 'K2 III',
      luminosity: '85 solar luminosities'
    },
    {
      id: 'star-2',
      name: 'Variable Star V1',
      x: 25000,
      y: 4500,
      type: 'Cepheid Variable',
      magnitude: 3.8,
      distance: '2.5 million light-years',
      temperature: '5,500 K',
      mass: '4.5 solar masses',
      description: 'A Cepheid variable star that pulsates regularly, making it an important standard candle for measuring cosmic distances. Its brightness varies over a period of 12.3 days.',
      constellation: 'Andromeda',
      spectralClass: 'F8 Ib',
      luminosity: '1,200 solar luminosities',
      variablePeriod: '12.3 days'
    },
    {
      id: 'star-3',
      name: 'Blue Supergiant BS-47',
      x: 18500,
      y: 6200,
      type: 'Blue Supergiant',
      magnitude: 2.1,
      distance: '2.5 million light-years',
      temperature: '25,000 K',
      mass: '20 solar masses',
      description: 'A massive blue supergiant star that burns extremely hot and bright. These stars have short lifespans and will eventually explode as supernovae.',
      constellation: 'Andromeda',
      spectralClass: 'O9 Ia',
      luminosity: '50,000 solar luminosities'
    },
    {
      id: 'star-4',
      name: 'Wolf-Rayet WR-23',
      x: 30000,
      y: 2800,
      type: 'Wolf-Rayet',
      magnitude: 5.7,
      distance: '2.5 million light-years',
      temperature: '50,000 K',
      mass: '15 solar masses',
      description: 'A Wolf-Rayet star in its final evolutionary stage, shedding its outer layers at tremendous speeds. These stars are precursors to black holes.',
      constellation: 'Andromeda',
      spectralClass: 'WN6',
      luminosity: '100,000 solar luminosities',
      windSpeed: '2,000 km/s'
    },
    {
      id: 'star-5',
      name: 'Neutron Star PSR J0045+41',
      x: 12000,
      y: 7500,
      type: 'Neutron Star',
      magnitude: 18.5,
      distance: '2.5 million light-years',
      temperature: '1,000,000 K',
      mass: '1.4 solar masses',
      description: 'A rapidly spinning neutron star (pulsar) that emits beams of radiation. This incredibly dense object is the remnant of a massive star that exploded as a supernova.',
      constellation: 'Andromeda',
      spectralClass: 'Pulsar',
      luminosity: '0.001 solar luminosities',
      rotationPeriod: '0.033 seconds',
      magneticField: '10^12 Gauss'
    },
    {
      id: 'star-6',
      name: 'Luminous Blue Variable LBV-M31',
      x: 35000,
      y: 5500,
      type: 'Luminous Blue Variable',
      magnitude: 1.8,
      distance: '2.5 million light-years',
      temperature: '30,000 K',
      mass: '40 solar masses',
      description: 'An extremely massive and luminous blue variable star that undergoes dramatic brightness changes. These rare stars are among the most massive known.',
      constellation: 'Andromeda',
      spectralClass: 'LBV',
      luminosity: '500,000 solar luminosities'
    },
    {
      id: 'star-8',
      name: 'White Dwarf Companion WD-31A',
      x: 22000,
      y: 7800,
      type: 'White Dwarf',
      magnitude: 12.4,
      distance: '2.5 million light-years',
      temperature: '25,000 K',
      mass: '0.6 solar masses',
      description: 'A white dwarf star that is the remnant of a Sun-like star. Despite its small size, it is extremely hot and dense.',
      constellation: 'Andromeda',
      spectralClass: 'DA',
      luminosity: '0.05 solar luminosities'
    },
    {
      id: 'star-9',
      name: 'Yellow Hypergiant YHG-M31',
      x: 38000,
      y: 3800,
      type: 'Yellow Hypergiant',
      magnitude: 2.9,
      distance: '2.5 million light-years',
      temperature: '5,000 K',
      mass: '25 solar masses',
      description: 'An extremely rare yellow hypergiant star. These are among the most luminous and unstable stars in the universe.',
      constellation: 'Andromeda',
      spectralClass: 'F8 Ia+',
      luminosity: '200,000 solar luminosities'
    },
    {
      id: 'star-10',
      name: 'Binary System Alpha-M31',
      x: 28000,
      y: 6800,
      type: 'Binary System',
      magnitude: 4.1,
      distance: '2.5 million light-years',
      temperature: '8,500 K',
      mass: '3.2 solar masses',
      description: 'A close binary star system where two stars orbit each other. The primary is a hot A-type star while the secondary is a cooler K-type star.',
      constellation: 'Andromeda',
      spectralClass: 'A5 V + K2 V',
      luminosity: '45 solar luminosities',
      orbitalPeriod: '2.3 days'
    },
    {
      id: 'star-11',
      name: 'Carbon Star C-M31',
      x: 14000,
      y: 8500,
      type: 'Carbon Star',
      magnitude: 6.8,
      distance: '2.5 million light-years',
      temperature: '2,800 K',
      mass: '2.5 solar masses',
      description: 'A cool carbon star with a distinctive deep red color. These stars have more carbon than oxygen in their atmospheres.',
      constellation: 'Andromeda',
      spectralClass: 'C-N',
      luminosity: '5,000 solar luminosities'
    },
    {
      id: 'star-12',
      name: 'Be Star Gamma-M31',
      x: 32000,
      y: 4200,
      type: 'Be Star',
      magnitude: 5.2,
      distance: '2.5 million light-years',
      temperature: '22,000 K',
      mass: '12 solar masses',
      description: 'A rapidly rotating B-type star surrounded by a circumstellar disk of gas. The rapid rotation causes material to be ejected from the equator.',
      constellation: 'Andromeda',
      spectralClass: 'B2 Ve',
      luminosity: '8,000 solar luminosities',
      rotationSpeed: '450 km/s'
    },
    {
      id: 'star-14',
      name: 'Herbig Ae/Be Star HAeBe-M31',
      x: 26000,
      y: 8200,
      type: 'Herbig Ae/Be Star',
      magnitude: 7.5,
      distance: '2.5 million light-years',
      temperature: '10,000 K',
      mass: '4.8 solar masses',
      description: 'A young pre-main sequence star still in the process of formation. It is surrounded by a protoplanetary disk where planets may be forming.',
      constellation: 'Andromeda',
      spectralClass: 'A0 Ve',
      luminosity: '150 solar luminosities',
      age: '5 million years'
    },
    {
      id: 'star-15',
      name: 'Horizontal Branch Star HB-M31',
      x: 36000,
      y: 7200,
      type: 'Horizontal Branch Star',
      magnitude: 8.9,
      distance: '2.5 million light-years',
      temperature: '7,200 K',
      mass: '0.7 solar masses',
      description: 'An evolved star in the horizontal branch phase, burning helium in its core. These stars are found in globular clusters and represent an intermediate evolutionary stage.',
      constellation: 'Andromeda',
      spectralClass: 'F2 IV',
      luminosity: '75 solar luminosities'
    },
    {
      id: 'star-16',
      name: 'T Tauri Star TT-M31',
      x: 10000,
      y: 4800,
      type: 'T Tauri Star',
      magnitude: 9.2,
      distance: '2.5 million light-years',
      temperature: '4,000 K',
      mass: '0.8 solar masses',
      description: 'A young variable pre-main sequence star still contracting gravitationally. These stars are often surrounded by protoplanetary disks and show strong stellar winds.',
      constellation: 'Andromeda',
      spectralClass: 'K7 Ve',
      luminosity: '2 solar luminosities',
      age: '2 million years'
    },
    {
      id: 'star-17',
      name: 'Supergiant Rigel-M31',
      x: 40000,
      y: 6500,
      type: 'Blue Supergiant',
      magnitude: 1.5,
      distance: '2.5 million light-years',
      temperature: '28,000 K',
      mass: '35 solar masses',
      description: 'A massive blue supergiant similar to Rigel in our galaxy. This star is one of the most luminous in the Andromeda Galaxy and will likely end as a supernova.',
      constellation: 'Andromeda',
      spectralClass: 'B8 Ia',
      luminosity: '300,000 solar luminosities'
    },
    {
      id: 'star-19',
      name: 'O-type Giant OG-M31',
      x: 33000,
      y: 8800,
      type: 'O-type Star',
      magnitude: 2.3,
      distance: '2.5 million light-years',
      temperature: '40,000 K',
      mass: '45 solar masses',
      description: 'An extremely hot and massive O-type star that burns through its fuel rapidly. These are among the rarest and most short-lived stars in the universe.',
      constellation: 'Andromeda',
      spectralClass: 'O4 III',
      luminosity: '400,000 solar luminosities'
    },
    {
      id: 'star-21',
      name: 'Eclipsing Binary EB-M31',
      x: 11000,
      y: 6200,
      type: 'Binary System',
      magnitude: 5.8,
      distance: '2.5 million light-years',
      temperature: '6,500 K',
      mass: '2.8 solar masses',
      description: 'An eclipsing binary system where two stars periodically pass in front of each other, causing regular brightness variations every 3.2 days.',
      constellation: 'Andromeda',
      spectralClass: 'F8 V + G2 V',
      luminosity: '12 solar luminosities',
      orbitalPeriod: '3.2 days'
    },
    {
      id: 'star-25',
      name: 'Blue Straggler BS-M31',
      x: 29000,
      y: 3500,
      type: 'Blue Straggler',
      magnitude: 4.7,
      distance: '2.5 million light-years',
      temperature: '12,000 K',
      mass: '2.1 solar masses',
      description: 'A blue straggler star that appears younger than its surroundings, likely formed through stellar mergers or mass transfer in a binary system.',
      constellation: 'Andromeda',
      spectralClass: 'B9 V',
      luminosity: '80 solar luminosities'
    },
    {
      id: 'star-26',
      name: 'S-type Star S-M31',
      x: 13000,
      y: 3800,
      type: 'S-type Star',
      magnitude: 8.1,
      distance: '2.5 million light-years',
      temperature: '3,200 K',
      mass: '2.2 solar masses',
      description: 'An S-type star with enhanced zirconium oxide bands in its spectrum. These stars are intermediate between M-type and carbon stars in their evolution.',
      constellation: 'Andromeda',
      spectralClass: 'S6/2',
      luminosity: '3,500 solar luminosities'
    },
    {
      id: 'star-27',
      name: 'Helium Star He-M31',
      x: 41000,
      y: 4800,
      type: 'Helium Star',
      magnitude: 6.9,
      distance: '2.5 million light-years',
      temperature: '50,000 K',
      mass: '8 solar masses',
      description: 'A rare helium star that has lost its hydrogen envelope, exposing the helium-burning core. These stars are progenitors of Type Ib/Ic supernovae.',
      constellation: 'Andromeda',
      spectralClass: 'WR',
      luminosity: '25,000 solar luminosities'
    },
    {
      id: 'star-28',
      name: 'Contact Binary CB-M31',
      x: 17000,
      y: 6800,
      type: 'Binary System',
      magnitude: 7.3,
      distance: '2.5 million light-years',
      temperature: '5,800 K',
      mass: '1.8 solar masses',
      description: 'A contact binary system where two stars share a common envelope. These systems evolve rapidly and may eventually merge into a single star.',
      constellation: 'Andromeda',
      spectralClass: 'G5 V + G8 V',
      luminosity: '3.2 solar luminosities',
      orbitalPeriod: '0.3 days'
    },
    {
      id: 'star-29',
      name: 'Extreme Helium Star EHe-M31',
      x: 23000,
      y: 5200,
      type: 'Extreme Helium Star',
      magnitude: 9.8,
      distance: '2.5 million light-years',
      temperature: '20,000 K',
      mass: '0.7 solar masses',
      description: 'An extremely rare star with a helium-dominated atmosphere and virtually no hydrogen. These stars may be the result of a late helium flash or white dwarf merger.',
      constellation: 'Andromeda',
      spectralClass: 'EHe',
      luminosity: '1,000 solar luminosities'
    },
    {
      id: 'star-31',
      name: 'RV Tauri Variable RV-M31',
      x: 9000,
      y: 7800,
      type: 'RV Tauri Variable',
      magnitude: 8.5,
      distance: '2.5 million light-years',
      temperature: '4,500 K',
      mass: '0.6 solar masses',
      description: 'A post-AGB pulsating variable star with alternating deep and shallow minima. These stars are evolving toward the white dwarf stage.',
      constellation: 'Andromeda',
      spectralClass: 'G0 Ib',
      luminosity: '2,000 solar luminosities',
      variablePeriod: '85 days'
    },
    {
      id: 'star-32',
      name: 'Ap Star Peculiar AP-M31',
      x: 31000,
      y: 7500,
      type: 'Ap Star',
      magnitude: 6.1,
      distance: '2.5 million light-years',
      temperature: '11,000 K',
      mass: '2.8 solar masses',
      description: 'A chemically peculiar A-type star with enhanced abundances of rare earth elements and strong magnetic fields. These stars show spectral line variations.',
      constellation: 'Andromeda',
      spectralClass: 'A0p',
      luminosity: '65 solar luminosities',
      magneticField: '5,000 Gauss'
    },
    {
      id: 'star-33',
      name: 'Symbiotic Star Sy-M31',
      x: 21000,
      y: 3200,
      type: 'Symbiotic Star',
      magnitude: 10.5,
      distance: '2.5 million light-years',
      temperature: '100,000 K',
      mass: '0.8 solar masses',
      description: 'A symbiotic star system consisting of a white dwarf accreting material from a red giant companion, creating a hot, ionized nebula around the system.',
      constellation: 'Andromeda',
      spectralClass: 'WD + M III',
      luminosity: '500 solar luminosities'
    },
    {
      id: 'star-35',
      name: 'Millisecond Pulsar MSP-M31',
      x: 39000,
      y: 8200,
      type: 'Neutron Star',
      magnitude: 22.1,
      distance: '2.5 million light-years',
      temperature: '500,000 K',
      mass: '1.6 solar masses',
      description: 'A rapidly spinning millisecond pulsar that has been spun up by accretion from a companion star. These are among the most precise timekeepers in the universe.',
      constellation: 'Andromeda',
      spectralClass: 'Pulsar',
      luminosity: '0.0001 solar luminosities',
      rotationPeriod: '0.003 seconds',
      magneticField: '10^8 Gauss'
    }
  ],
  'whirlpool-fallback': [
    {
      id: 'star-w1',
      name: 'Spiral Arm Giant SAG-1',
      x: 8000,
      y: 4000,
      type: 'Red Supergiant',
      magnitude: 3.5,
      distance: '23 million light-years',
      temperature: '3,500 K',
      mass: '12 solar masses',
      description: 'A red supergiant located in one of the prominent spiral arms of the Whirlpool Galaxy. This star is nearing the end of its life cycle.',
      constellation: 'Canes Venatici',
      spectralClass: 'M2 Ia',
      luminosity: '10,000 solar luminosities'
    },
    {
      id: 'star-w2',
      name: 'Blue Giant BG-M51',
      x: 12000,
      y: 6000,
      type: 'Blue Giant',
      magnitude: 4.1,
      distance: '23 million light-years',
      temperature: '15,000 K',
      mass: '8 solar masses',
      description: 'A hot blue giant star illuminating the surrounding nebular regions in the Whirlpool Galaxy with its intense ultraviolet radiation.',
      constellation: 'Canes Venatici',
      spectralClass: 'B2 V',
      luminosity: '2,500 solar luminosities'
    }
  ],
  'sombrero-fallback': [
    {
      id: 'star-s1',
      name: 'Dust Lane Star DLS-104',
      x: 6000,
      y: 3000,
      type: 'Yellow Dwarf',
      magnitude: 6.2,
      distance: '28 million light-years',
      temperature: '5,800 K',
      mass: '1.1 solar masses',
      description: 'A Sun-like yellow dwarf star located near the prominent dust lane of the Sombrero Galaxy. This star is similar to our own Sun in many characteristics.',
      constellation: 'Virgo',
      spectralClass: 'G2 V',
      luminosity: '1.2 solar luminosities'
    }
  ],
  'pinwheel-fallback': [
    {
      id: 'star-p1',
      name: 'Outer Arm Variable OAV-101',
      x: 10000,
      y: 5000,
      type: 'RR Lyrae Variable',
      magnitude: 7.8,
      distance: '21 million light-years',
      temperature: '6,000 K',
      mass: '0.8 solar masses',
      description: 'An RR Lyrae variable star in the outer regions of the Pinwheel Galaxy. These stars are important for measuring galactic distances and studying stellar populations.',
      constellation: 'Ursa Major',
      spectralClass: 'A7 V',
      luminosity: '50 solar luminosities',
      variablePeriod: '0.6 days'
    }
  ],
  'cartwheel-fallback': [
    {
      id: 'star-c1',
      name: 'Ring Formation Star RFS-1',
      x: 7500,
      y: 4500,
      type: 'O-type Star',
      magnitude: 2.8,
      distance: '500 million light-years',
      temperature: '35,000 K',
      mass: '25 solar masses',
      description: 'A massive O-type star formed in the ring structure of the Cartwheel Galaxy, likely triggered by the galactic collision that created this unique formation.',
      constellation: 'Sculptor',
      spectralClass: 'O5 V',
      luminosity: '80,000 solar luminosities'
    }
  ]
};

// Function to get stars for a specific galaxy
export const getStarsForGalaxy = (galaxyId) => {
  return starData[galaxyId] || [];
};

// Function to get star by ID
export const getStarById = (galaxyId, starId) => {
  const galaxyStars = starData[galaxyId] || [];
  return galaxyStars.find(star => star.id === starId);
};

// Function to check if a point is near a star (for click detection)
export const findNearestStar = (galaxyId, x, y, threshold = 50) => {
  const galaxyStars = starData[galaxyId] || [];
  
  for (const star of galaxyStars) {
    const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
    if (distance <= threshold) {
      return star;
    }
  }
  
  return null;
};
