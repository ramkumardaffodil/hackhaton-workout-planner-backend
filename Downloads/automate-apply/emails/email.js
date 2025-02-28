import FileHandler from "../utils/readFile";
import scrapeEmailFormats from "./domain-extraction/extract-domain";

const findAndgenerateEmail = async (companyName) => {
  /* 
    1. fetch the company domain and email pattern
    2. update the company file
    2. fetch the people of that company
    3. mail the people of the company
*/

  const patterns = await scrapeEmailFormats(companyName);
  const file = new FileHandler(companyName);
  let allCompany = file.readFile();
  // const company = company[companyName]
  allCompany[companyName]["format"] = patterns;
};
