const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://corwintcheung:XGqPgTqpEuJDFnUd@cluster0.c2rk75b.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
