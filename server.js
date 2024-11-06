const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();

// Enable CORS for all origins
app.use(cors());

// Set up multer storage without renaming files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder for uploaded files
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use the original file name
        cb(null, file.originalname);
    }
});

// Create an upload instance without file filter (allows any file type)
const upload = multer({ storage: storage });

// Create a route to handle file uploads (single file)
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({
        message: 'File uploaded successfully!',
        file: req.file
    });
});

// Create a route to get the number of files in the 'uploads' folder
app.get('/api/files/count', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');

    // Read the contents of the 'uploads' directory
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the uploads directory' });
        }

        // Filter out directories, only count files
        const fileCount = files.filter(file => fs.statSync(path.join(uploadDir, file)).isFile()).length;
        
        // Return the file count
        res.json({ fileCount });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
