import PDFMerger from "pdf-merger-js";
import puppeteer from "puppeteer";
import { allowCors } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Handler de manipulação de relatórios.
 * @method handler
 * @memberof module:reports
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {Object} HTTP response como JSON contendo a resposta da query consultada.
 */
const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const {
          entity,
          reportUrl,
          id,
          landscape = false,
          anexosId = null,
          ...params
        } = req.query;
        const browser = await puppeteer.launch({
          headless: true,
          executablePath:
            process.env.NODE_ENV === "production"
              ? "/usr/bin/chromium-browser"
              : null,
          args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--lang=pt-BR",
          ],
        });

        const query = Object.keys(req.query)
          .map((key) => `${key}=${req.query[key]}`)
          .join("&");

        const page = await browser.newPage();

        await page.goto(
          `${process.env.NEXT_PUBLIC_PPE_FRONTEND}/${entity}/${reportUrl}?${query}`,
          {
            waitUntil: "networkidle0",
          }
        );
        const title = await page.title();
        res.setHeader("Content-Disposition", "attachment;filename=" + title);

        if (landscape === "custom") {
          const pagesWithOrientation = await page.$$eval(
            ".page",
            (pagesToPrint) =>
              pagesToPrint.map((pageToPrint, idx) => ({
                pageId: pageToPrint.id,
                pageNumber: idx + 1,
              }))
          );

          const pagesPrinted = [];

          for await (const pageToPrint of pagesWithOrientation) {
            const print = await page.pdf({
              printBackground: true,
              format: "A4",
              displayHeaderFooter: false,
              landscape: pageToPrint.pageId === "landscape",
              pageRanges: `${pageToPrint.pageNumber}`,
              margin: {
                top: "20px",
                bottom: "40px",
                right: "30px",
                left: "30px",
              },
            });
            pagesPrinted.push(print);
          }

          const merger = new PDFMerger();

          for (const file of pagesPrinted) {
            await merger.add(file);
          }

          const mergedPdf = await merger.saveAsBuffer();
          await browser.close();
          return res.send(mergedPdf);
        } else {
          const pdf = await page.pdf({
            printBackground: true,
            format: "A4",
            displayHeaderFooter: false,
            landscape: JSON.parse(landscape),
            margin: {
              top: "20px",
              bottom: "40px",
              right: "30px",
              left: "30px",
            },
          });

          await browser.close();
          return res.send(pdf);
        }
      } catch (e) {
        return exceptionHandler(e, res);
      }
    default:
      return exceptionHandler(null, res);
  }
};

export default allowCors(handler);
