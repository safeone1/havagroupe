// Test script to verify attributes functionality
// This is for documentation and testing purposes

// Example of valid JSON attributes that can be used:

const validAttributesExamples = [
  // Basic attributes
  {
    "color": "red",
    "size": "large",
    "material": "cotton"
  },

  // Complex attributes with nested objects
  {
    "dimensions": {
      "width": 10,
      "height": 20,
      "depth": 5
    },
    "weight": "1.2kg",
    "features": ["waterproof", "lightweight", "durable"]
  },

  // Technical specifications
  {
    "cpu": "Intel i7",
    "memory": "16GB",
    "storage": "512GB SSD",
    "graphics": "NVIDIA RTX 3060",
    "ports": {
      "usb": 4,
      "hdmi": 2,
      "ethernet": 1
    }
  },

  // Clothing attributes
  {
    "brand": "Nike",
    "size": "L",
    "color": "blue",
    "gender": "unisex",
    "season": "spring/summer",
    "care_instructions": ["machine wash", "do not bleach", "tumble dry low"]
  },

  // Electronics attributes
  {
    "power": "100W",
    "voltage": "220V",
    "frequency": "50Hz",
    "warranty": "2 years",
    "certifications": ["CE", "FCC", "RoHS"],
    "energy_rating": "A+++"
  }
];

// Invalid examples (these should fail validation):
const invalidAttributesExamples = [
  // Array (not allowed)
  ["color", "red", "size", "large"],
  
  // String (not allowed)
  "color: red, size: large",
  
  // Number (not allowed)
  123,
  
  // Invalid JSON syntax
  '{"color": "red", "size": }' // missing value
];

export { validAttributesExamples, invalidAttributesExamples };
