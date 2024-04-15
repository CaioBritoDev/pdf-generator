export default async function handler(req, res) {
  //if (req.method === 'POST') {
    try {
      // Get HTML content from request body
      const htmlContent = req.body.htmlContent ? req.body.htmlContent : "<html><h1>Hello, World!</h1></html>";

      const wkhtmltopdf = require("wkhtmltopdf");

      // Generate PDF using wkhtmltopdf
      wkhtmltopdf(htmlContent)
        .pipe(res);

    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
    }
  //} else {
   // res.status(405).send('Method Not Allowed');
  //}
}
