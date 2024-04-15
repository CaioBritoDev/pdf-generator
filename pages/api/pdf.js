
import puppeteer from 'puppeteer';
import htmlToPdf from 'puppeteer-html-pdf';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const htmlContent = req.body.htmlContent;

      // Inicializa o navegador Puppeteer
      const browser = await puppeteer.launch();

      // Abre uma nova página
      const page = await browser.newPage();

      // Define o conteúdo HTML na página
      await page.setContent(htmlContent);

      // Gera o PDF usando puppeteer-html-pdf
      const pdfBuffer = await htmlToPdf.generatePdf(page);

      // Fecha o navegador
      await browser.close();

      // Define os cabeçalhos da resposta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated_pdf.pdf');

      // Envie o PDF como resposta
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      res.status(500).send('Erro interno do servidor');
    }
  } else {
    res.status(405).send('Método não permitido');
  }
}