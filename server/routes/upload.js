const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Meal = require('../models/Meal');  // Import the Meal model
const router = express.Router();

const uploadDir = path.join(__dirname, '../public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/upload-image', async (req, res) => {
    const { url, mealId } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'Image URL is required' });
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        const timestamp = Date.now();
        const imageName = `${timestamp}.jpg`;
        const imagePath = path.join(uploadDir, imageName);
        const resizedImagePath = path.join(uploadDir, `resized-${imageName}`);

        // Save the original image
        await sharp(imageBuffer).toFile(imagePath);

        // Resize and save the image
        await sharp(imageBuffer).resize(300, 300).toFile(resizedImagePath);

        const savedImageUrl = `/uploads/resized-${imageName}`;

        // Optionally update the meal's imageUrl if mealId is provided
        if (mealId) {
            const meal = await Meal.findByPk(mealId);
            if (meal) {
                meal.imageUrl = savedImageUrl;
                await meal.save();
            }
        }

        res.status(200).json({ message: 'Image uploaded successfully', imageUrl: savedImageUrl });
    } catch (error) {
        console.error('Error uploading image:', error.message);
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
});

module.exports = router;
