import { chromium } from 'playwright';

export default async function handler(req, res) {
    try {
        // Get dynamic data from the request body
        const { name, age } = req.body;

        // Launch a headless browser instance (Playwright uses Chromium by default)
        const browser = await chromium.launch({ executablePath: '/usr/bin' });

        // Create a new page in the browser
        const page = await browser.newPage();

        // Construct HTML content with dynamic data
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

        // Close the browser
        await browser.close();

        // Send the generated PDF buffer as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=generated_pdf.pdf');
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
