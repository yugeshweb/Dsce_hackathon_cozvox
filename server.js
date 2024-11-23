const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(cors()); // Allow requests from all origins

// Sample data for pincode-based delivery rates
const rates = {
    "110002": { state: "Delhi", rate: 50 },
    "400001": { state: "Mumbai", rate: 70 },
   
};

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Endpoint to estimate delivery charges
app.post('/estimate', (req, res) => {
    const { pincode, weight, material } = req.body;

    // Check if the pincode exists in the data
    if (!rates[pincode]) {
        return res.status(404).json({ message: 'Pincode not found' });
    }

    // Get the base rate for the pincode
    const baseRate = rates[pincode].rate;

    // Calculate delivery charge based on weight and material type
    let materialFee = 0;
    switch (material) {
        case 'Fragile':
            materialFee = 50;
            break;
        case 'Perishable':
            materialFee = 75;
            break;
        case 'Hazardous':
            materialFee = 90;
            break;
        default:
            materialFee = 100;
    }

    // Formula for final charge: base rate + (weight * per-kg rate) + material handling fee
    const finalCharge = baseRate + weight * 10 + materialFee;

    // Return the result as a JSON response
    res.json({
        state: rates[pincode].state,
        estimatedCharge: finalCharge,
        materialFee: materialFee,
    });
});

// Start the server
const PORT = 5000; // You can change the port if needed
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
