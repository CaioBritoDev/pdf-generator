import pdf from 'html-pdf';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            // Get dynamic data from the request body
            const { name, age } = req.body;

            // Generate a unique filename for the PDF
            const pdfFileName = `generated_${uuidv4()}.pdf`;

            // HTML content with dynamic data
            const htmlContent = `
                <html>
                <head><title>Generated PDF</title></head>
                <body>
                    <h1>Hello, ${name}!</h1>
                    <p>You are ${age} years old.</p>
                </body>
                </html>
            `;

            // Options for PDF generation
            const options = { format: 'Letter' };

            // Generate PDF
            pdf.create(htmlContent, options).toFile(pdfFileName, async (err, result) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    return res.status(500).send('Error generating PDF');
                }
                
                // Set response headers
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);

                // Send the PDF file as the response
                const pdfBuffer = fs.readFileSync(pdfFileName);
                res.send(pdfBuffer);

                // Delete the generated PDF file
                fs.unlinkSync(pdfFileName);
            });
        } else {
            res.status(405).send({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
