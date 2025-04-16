require('dotenv').config();
const writeSpots = require('../app/domains/spots/writeSpots');

(async () => {
  const testSpots = [
    {
      placeId: 'test-123-akiba',
      name: 'Test Animate Akiba',
      lat: 35.7,
      lng: 139.77,
      formatted_address: 'Test address',
      types: ['store', 'book_store']
    },
    {
      placeId: 'test-456-nakano',
      name: 'Test Nakano Broadway',
      lat: 35.707,
      lng: 139.665,
      formatted_address: 'Test address 2',
      types: ['shopping_mall', 'point_of_interest']
    }
  ];

  await writeSpots(testSpots);
})();
