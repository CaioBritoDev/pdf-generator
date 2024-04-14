import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        // Get dynamic data from the request body
        const { name, age } = req.body;

        // Launch a headless browser instance
        const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' });

        // Open a new page
        const page = await browser.newPage();

        // Set the HTML content with dynamic data
        const htmlContent = `
            <html>
            <head><title>Generated PDF</title></head>
            <body>
                <h1>Hello, ${name}!</h1>
                <p>You are ${age} years old.</p>
            </body>
            </html>
        `;

        // Set the HTML content of the page
        await page.setContent(htmlContent);

        // Generate PDF from the HTML content
        const pdfBuffer = await page.pdf();

        // Close the browser instance
        await browser.close();

        // Save the PDF file to a publicly accessible location
        const filePath = path.join(process.cwd(), 'public', 'generated_pdf.pdf');
        fs.writeFileSync(filePath, pdfBuffer);

        // Return the URL to download the saved PDF file
        const downloadUrl = `${process.env.PUBLIC_SITE_URL}/generated_pdf.pdf`;
        res.status(200).json({ downloadUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}