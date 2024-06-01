const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

const DATA_FILE = './rooms.json';

// Helper function to read data from the JSON file
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/rooms', (req, res) => {
    const rooms = readData();
    res.json(rooms);
});

app.get('/api/rooms/:name', (req, res) => {
    const rooms = readData();
    const room = rooms.find(room => room.name === req.params.name);
    if (room) {
        res.json(room);
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

app.post('/api/rooms', (req, res) => {
    const rooms = readData();
    const newRoom = req.body;
    rooms.push(newRoom);
    writeData(rooms);
    res.status(201).json(newRoom);
});

app.put('/api/rooms/:name', (req, res) => {
    const rooms = readData();
    const roomIndex = rooms.findIndex(room => room.name === req.params.name);
    if (roomIndex !== -1) {
        rooms[roomIndex] = { ...rooms[roomIndex], ...req.body };
        writeData(rooms);
        res.json(rooms[roomIndex]);
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

app.delete('/api/rooms/:name', (req, res) => {
    let rooms = readData();
    const roomIndex = rooms.findIndex(room => room.name === req.params.name);
    if (roomIndex !== -1) {
        rooms = rooms.filter(room => room.name !== req.params.name);
        writeData(rooms);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
