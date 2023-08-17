const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;


const app = express();

app.use(cors());

app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const stateSchema = new mongoose.Schema({}, { strict: false });

const State = mongoose.model('State', stateSchema);

app.get('/api/state', async (req, res) => {
    try {
        const allStates = await State.find();  // Fetches all documents
        // let state = await State.findOne();
        // if (!state) {
        //     state = {
        //         available: true,  // default values
        //         unavailable: false // default values
        //     };
        // }
        console.log("Retrieved state from database:", allStates); 
        res.json(allStates);
    } catch (error) {
        console.error("Error fetching state:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/api/state', async (req, res) => {
    try {
        const newStateData = req.body;
        
        // The upsert option creates a new document if no documents match the filter
        await State.findOneAndUpdate({}, { $set: newStateData }, { upsert: true, new: true });
        
        res.json({ message: 'State updated successfully' });
    } catch (error) {
        console.error("Error updating state:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// app.get('/api/clear-state', async (req, res) => {
//     try {
//         await State.deleteMany({});
//         res.json({ message: 'State cleared successfully' });
//     } catch (error) {
//         console.error("Error clearing state:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    // Close server & exit process
    server.close(() => process.exit(1));
});
