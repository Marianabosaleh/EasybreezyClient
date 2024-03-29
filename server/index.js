// const express = require('express');
// const router = express.Router();
// const puppeteer = require('puppeteer');

// // Initialize Firebase Admin SDK and Firestore
// const admin = require("firebase-admin");
// const serviceAccount = require("./service_account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// router.get('/scrape', async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({

//     });
//     const page = await browser.newPage();
    
//     // Navigate to the Amazon homepage
//     await page.goto('https://www.amazon.com/');
    
//     // Click on the category link for shoes
//     await page.click('a[href="/s?k=shoes&ref=nb_sb_noss_2"]');
    
//     // Wait for the products to load on the shoes category page
//     await page.waitForSelector('.s-result-item');

//     // Scrape product data from the first shoe product on the page
//     const product = await page.evaluate(() => {
//       const productElement = document.querySelector('.s-result-item');
//       if (!productElement) {
//         throw new Error('No shoe products found on the page');
//       }

//       const productName = productElement.querySelector('h2').innerText;
//       const productPrice = productElement.querySelector('.a-price .a-offscreen').innerText;
//       const productDescription = productElement.querySelector('.a-size-base-plus').innerText;

//       return {
//         name: productName,
//         price: productPrice,
//         description: productDescription
//       };
//     });

//     // Add the product data to Firestore
//     await db.collection('products').doc('shoes').collection('items').add(product);

//     await browser.close();
//     res.status(200).send('Data scraped and updated successfully');
//   } catch (error) {
//     console.error('Error scraping data:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// module.exports = router;
