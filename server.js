
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Read votes from a JSON file (mock database)
const readVotes = () => {
    return JSON.parse(fs.readFileSync('votes.json'));
};

// Write votes to the JSON file
const writeVotes = (data) => {
    fs.writeFileSync('votes.json', JSON.stringify(data, null, 2));
};

app.get('/teachers', (req, res) => {
    const votes = readVotes();
    res.json(votes);
});

app.post('/vote', (req, res) => {
    const teacherName = req.body.teacher;
    const votes = readVotes();
    
    // Check if the teacher is already voted for
    const teacher = votes.find(t => t.name === teacherName);
    if (teacher && !teacher.voted) {
        teacher.voted = true; // Mark teacher as voted
        writeVotes(votes);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Reset votes at 8:00 AM (simple reset logic, improve for production)
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 8) {
        const votes = readVotes();
        votes.forEach(teacher => teacher.voted = false); // Reset all votes
        writeVotes(votes);
        console.log('Votes reset at 8:00 AM');
    }
}, 3600000); // Check every hour

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
