# Product Attributes Feature

## Overview

The product attributes feature allows administrators to add custom JSON attributes to products. These attributes can store any product-specific information that doesn't fit into the standard product fields.

## How to Use

### Adding Attributes

1. Go to the Admin Panel > Products
2. Click "Add New Product" or edit an existing product
3. Scroll down to the "Attributes (JSON)" section
4. Enter your attributes in valid JSON format

### Attributes Editor Features

- **Real-time validation**: The editor shows whether your JSON is valid
- **Format button**: Automatically formats your JSON for better readability
- **Example button**: Adds a sample set of attributes to get you started
- **Clear button**: Removes all attributes
- **Attribute counter**: Shows how many attributes you have defined

### JSON Format Requirements

Attributes must be a valid JSON object (not an array or primitive value). Examples:

#### Valid ✅
```json
{
  "color": "red",
  "size": "large",
  "material": "cotton"
}
```

```json
{
  "dimensions": {
    "width": 10,
    "height": 20,
    "depth": 5
  },
  "weight": "1.2kg",
  "features": ["waterproof", "lightweight", "durable"]
}
```

#### Invalid ❌
```json
["color", "red", "size", "large"]  // Array not allowed
```

```
color: red, size: large  // Not valid JSON
```

```json
"just a string"  // String not allowed
```

## Use Cases

### Product Specifications
Store technical specifications for electronics, appliances, etc.:
```json
{
  "cpu": "Intel i7",
  "memory": "16GB",
  "storage": "512GB SSD",
  "graphics": "NVIDIA RTX 3060"
}
```

### Clothing Details
Store fashion-specific information:
```json
{
  "size": "L",
  "color": "blue",
  "gender": "unisex",
  "season": "spring/summer",
  "care_instructions": ["machine wash", "do not bleach"]
}
```

### Custom Properties
Any custom information relevant to your business:
```json
{
  "supplier": "ABC Company",
  "warranty": "2 years",
  "eco_friendly": true,
  "made_in": "France"
}
```

## Technical Implementation

### Database Schema
- Attributes are stored as JSON in the `attributes` column of the `Product` table
- The field is nullable and defaults to `null`

### API Integration
- The `createProductWithSchema` and `updateProductWithSchema` functions handle JSON parsing
- Invalid JSON is gracefully handled and defaults to an empty object

### Frontend Components
- `AttributesEditor`: Advanced JSON editor with validation and formatting
- `AttributesDisplay`: Compact display component for product lists

## Validation

The system validates that:
1. The input is valid JSON syntax
2. The parsed result is an object (not array or primitive)
3. Empty/null values are handled gracefully

Invalid JSON will show an error message and prevent form submission.

## Benefits

1. **Flexibility**: Add any custom information without database changes
2. **Searchable**: Attributes can be searched and filtered (future feature)
3. **Structured**: JSON format ensures data consistency
4. **User-friendly**: Visual editor makes it easy for non-technical users
5. **Validation**: Real-time feedback prevents errors

## Future Enhancements

- Search and filter products by attributes
- Attribute templates for common product types
- Attribute comparison features
- Import/export attribute definitions
