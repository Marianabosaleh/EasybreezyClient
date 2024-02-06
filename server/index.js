const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
var admin = require("firebase-admin");

var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easybreezy-30c56-default-rtdb.asia-southeast1.firebasedatabase.app"
});

router.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Puppeteer scraping logic
    // Example: Scrape data from a website
    await page.goto('https://example.com');
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        content: document.querySelector('p').textContent.trim(),
      };
    });
    // Update Firebase with scraped data
    await admin.database().ref('scrapedData').push(data);
    await browser.close();
    res.status(200).send('Data scraped and updated successfully');
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
