
import { exec } from 'child_process';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get HTML content from request body
      const htmlContent = req.body.htmlContent;

      // Generate PDF using wkhtmltopdf
      const pdfBuffer = await generatePDF(htmlContent);

      // Send PDF as response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated_pdf.pdf');
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

// Function to generate PDF using wkhtmltopdf
function generatePDF(htmlContent) {
  return new Promise((resolve, reject) => {
    const command = `/usr/local/bin/wkhtmltopdf - -`;
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      } else if (stderr) {
        console.error('stderr:', stderr);
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });

    // Write HTML content to stdin of wkhtmltopdf process
    childProcess.stdin.write(htmlContent);
    childProcess.stdin.end();
  });
}