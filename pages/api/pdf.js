import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    try {
        // Get dynamic data from the request body
        const { name, age } = req.body;

        // Launch a headless browser instance
        const browser = await puppeteer.launch();

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

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="generated_pdf.pdf"');

        // Send the PDF buffer as the response
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
