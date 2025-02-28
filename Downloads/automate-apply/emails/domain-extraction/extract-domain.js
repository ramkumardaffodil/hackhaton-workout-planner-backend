const puppeteer = require("puppeteer");

async function scrapeEmailFormats(companyName) {
  if (!companyName) {
    console.log("Please provide a company name.");
    return;
  }

  console.log(`Fetching email formats for: ${companyName}...`);

  const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
  const page = await browser.newPage();

  // Randomly choose between Google and DuckDuckGo
  const searchEngines = [
    {
      url: `https://duckduckgo.com/?t=h_&q=${encodeURIComponent(
        companyName
      )}+email+address+format+rocket-reach&ia=web`,
      selector: ".ikg2IXiCD14iVX7AdZo1 h2 a", // DuckDuckGo result title selector
      engine: "DuckDuckGo",
    },
  ];

  const randomSearchEngine =
    searchEngines[Math.floor(Math.random() * searchEngines.length)];

  console.log(`Using ${randomSearchEngine.engine} for search...`);

  await page.goto(randomSearchEngine.url, { waitUntil: "networkidle2" });

  // Click the first search result
  const firstResultSelector = randomSearchEngine.selector;
  await page.waitForSelector(firstResultSelector);
  const firstLink = await page.evaluate((selector) => {
    const result = document.querySelector(selector);
    return result ? result.href : null;
  }, firstResultSelector); // Pass selector dynamically

  if (!firstLink) {
    console.log("No result found.");
    await browser.close();
    return;
  }

  await page.goto(firstLink, { waitUntil: "networkidle2" });

  // Scrape email formats from the table
  const emailFormats = await page.evaluate(() => {
    const tableRows = document.querySelectorAll(".table tbody tr");
    const results = [];

    tableRows.forEach((row) => {
      const emailFormat = row.children[0]?.innerText.trim();
      const exampleEmail = row.children[1]?.innerText.trim();
      const percentage = row.children[2]?.innerText.trim();

      if (emailFormat && exampleEmail && percentage) {
        results.push({
          format: emailFormat,
          email: exampleEmail,
          percentage: parseFloat(percentage.replace("%", "")), // Convert percentage to number
        });
      }
    });

    return results;
  });

  await browser.close();

  if (emailFormats.length === 0) {
    console.log("No email formats found.");
    return;
  }

  // Find the highest percentage email format
  const highestEmailFormat = emailFormats.reduce((max, item) =>
    item.percentage > max.percentage ? item : max
  );

  console.log(`Most common email format for ${companyName}:`, highestEmailFormat);
  return highestEmailFormat;
}

// // Get company name from command-line argument
// const companyName = process.argv.slice(2).join(" ");

// scrapeEmailFormats(companyName);

export default scrapeEmailFormats