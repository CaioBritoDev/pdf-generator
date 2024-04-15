export default async function handler(req, res) {

  const html = req.body;

  const PuppeteerHTMLPDF = require('puppeteer-html-pdf');

  const htmlPDF = new PuppeteerHTMLPDF();

  const options = { 
    format: 'A4'
  }

  htmlPDF.setOptions(options);
      
  try {
    const pdf = await htmlPDF.create(html); 
    res.send(pdf);
  } catch (error) {
    console.log('PuppeteerHTMLPDF error', error);
  }

}
