const pageScraper = require('./pageScraper');
const fs = require('fs');
async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedData = [];
    limitPage = 3;
    for (let i = 2; i <= limitPage; i++) {
      let url = `https://www.imdb.com/search/keyword/?ref_=kw_ref_yr&mode=detail&page=${i}&genres=Documentary%2CMusic&release_date=2008%2C2015&sort=year,asc`;

      scrapedData['Page' + i] = await pageScraper.scraper(browser, url);

      fs.writeFile(`./data/2008-2015_page${i}.json`, JSON.stringify(scrapedData[`Page${i}`]), 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The data has been scraped and saved successfully! View it at './data.json'");
      });
    }
    await browser.close();
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
