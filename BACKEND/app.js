const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());
//const path = require('path');


app.use('/', express.static(path.join(__dirname, 'public')));

// entire data in db
const filePath = path.join(__dirname, 'db.json');
app.get('/pets', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});


app.get('/pets/search', (req, res) => {
    console.log('Received request:', req.query);

    const { type, breed, city } = req.query;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err); 
            return res.status(500).json({ error: 'Failed to read file' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
            console.log('Parsed JSON data:', jsonData); 
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr); 
            return res.status(500).json({ error: 'Failed to parse JSON data' });
        }

        // Filter based on query parameters
        if (type) {
            jsonData = jsonData.filter(pet => pet.type.toLowerCase() === type.toLowerCase());
        }
        if (breed) {
            jsonData = jsonData.filter(pet => pet.breed.toLowerCase() === breed.toLowerCase());
        }
        if (city) {
            jsonData = jsonData.filter(pet => pet.city.toLowerCase() === city.toLowerCase());
        }
        
        //console.log('Filtered results:', jsonData); // Logs filtered results
        res.json(jsonData);
    });
});


// app.get('/pets/search', (req, res) => {
//     const { type, breed, city } = req.query;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Failed to read file:', err);
//             return res.status(500).json({ error: 'Failed to read file' });
//         }

//         let jsonData;
//         try {
//             jsonData = JSON.parse(data);
//         } catch (parseError) {
//             console.error('Failed to parse JSON:', parseError);
//             return res.status(500).json({ error: 'Failed to parse JSON' });
//         }

//         if (!Array.isArray(jsonData)) {
//             return res.status(500).json({ error: 'Invalid JSON format: Expected an array' });
//         }

//         const filteredPets = jsonData.filter(pet => {
//             const matchesType = type ? pet.type.toLowerCase() === type.toLowerCase() : true;
//             const matchesBreed = breed ? pet.breed.toLowerCase() === breed.toLowerCase() : true;
//             const matchesCity = city ? pet.city.toLowerCase() === city.toLowerCase() : true;

//             return matchesType && matchesBreed && matchesCity;
//         });

//         res.json(filteredPets);
//     });
// }); comment


app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3000");
});
