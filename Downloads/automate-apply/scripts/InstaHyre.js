const axios = require("axios");
const { saveFile } = require("../utils/saveJob");
const { randomDelay } = require("../utils/randomDelay");
const { keywords } = require("../profile/prodile");

const saveJobToFile = saveFile("InstaHyre-jobs_applied.json");

// Headers with the CSRF token and session cookies (ensure these are up-to-date)
const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "X-CSRFToken":
    "9T38mhvCJpfbWE7EETEgtw7GEIjVIvd6jbExAB1BvC26BuQkQNXkV61DPBi1jpsN",
  Cookie:
    "csrftoken=9T38mhvCJpfbWE7EETEgtw7GEIjVIvd6jbExAB1BvC26BuQkQNXkV61DPBi1jpsN; sessionid=bfhjj3p0t8frilnja1w28emzvkhpgfs7",
  Referer:
    "https://www.instahyre.com/candidate/opportunities/?company_size=0&job_functions=%2Fapi%2Fv1%2Fjob_category%2F1&job_type=0&search=true&skills=JavaScript&years=3",
};

// API endpoints
const JOB_SEARCH_URL = "https://www.instahyre.com/api/v1/job_search";
const JOB_OPPORTUNITY_URL =
  "https://www.instahyre.com/api/v1/candidate_opportunity";
const APPLY_URL =
  "https://www.instahyre.com/api/v1/candidate_opportunity/apply";

// Job categories for random application
const JOB_CATEGORIES = Object.keys(keywords);

const YEARS = 3;
const LIMIT = 30;

// Fetch jobs with pagination
async function fetchJobs(skill, offset = 0) {
  const params = {
    company_size: 0,
    job_categories: 1,
    job_type: 0,
    offset,
    skills: skill,
    status: 0,
    years: YEARS,
    limit: LIMIT,
  };

  try {
    const response = await axios.get(JOB_SEARCH_URL, { headers, params });
    return response.data.objects;
  } catch (error) {
    console.error(
      "Error fetching jobs:",
      error.response?.data || error.message
    );
    return [];
  }
}

// Fetch opportunities with pagination
async function fetchOpportunities(offset = 0) {
  const params = {
    offset,
    status: 0,
    limit: LIMIT,
    interest_facet: 0,
  };

  try {
    const response = await axios.get(JOB_OPPORTUNITY_URL, { headers, params });
    return response.data.objects;
  } catch (error) {
    console.error(
      "Error fetching opportunities:",
      error.response?.data || error.message
    );
    return [];
  }
}

// Apply for a job
async function applyForJob(jobId, props) {
  const data = {
    id: null,
    is_interested: true,
    job_id: jobId,
    is_activity_page_job: false,
  };

  try {
    const response = await axios.post(APPLY_URL, data, { headers });
    saveJobToFile({
      jobId,
      ...props,
    });
    console.log(
      `Applied to job ID ${jobId}: ${response.status} ${response.statusText}`
    );
  } catch (error) {
    console.error(
      `Error applying to job ID ${jobId}:`,
      error.response?.data || error.message
    );
  }
}

// Apply to all opportunities
async function applyToOpportunities() {
  console.log(">>> Running InstaHyre appLyOpportunity script");

  let offset = 0;
  let opportunities;

  do {
    opportunities = await fetchOpportunities(offset);
    for (const opportunity of opportunities) {
      console.log(
        "Applying for opportunity: ",
        opportunity.job.title,
        " at ",
        opportunity.employer.company_name
      );
      await applyForJob(opportunity.job.id),
        {
          companyName: opportunity.employer.company_name,
          title: opportunity.job.title,
        };
      await randomDelay();
    }
    offset += LIMIT;
  } while (opportunities.length > 0);

  console.log("Completed applying to all available opportunities.");
}

// Apply to all jobs with random skills
async function applyToJobs() {
  console.log(">>> Running InstaHyre applyTo job Script");
  let offset = 0;
  let jobs;

  do {
    const skill =
      JOB_CATEGORIES[Math.floor(Math.random() * JOB_CATEGORIES.length)];
    console.log(`Randomly applying to jobs with skill: ${skill}`);
    jobs = await fetchJobs(skill, offset);
    for (const job of jobs) {
      console.log(
        "Applying for job: ",
        job.title,
        " at ",
        job.employer.company_name
      );
      try {
        await applyForJob(job.id, {
          companyName: job.employer.company_name,
          title: job.title,
        });
        await randomDelay();
      } catch (err) {
        cosnole.log(">> Error from InsatHyre");
      }
    }
    offset += LIMIT;
  } while (jobs.length > 0);

  console.log("Completed applying to all available jobs.");
}

// Parse command-line arguments

// if (args.includes("--opportunity")) {
applyToOpportunities();
// } else if (args.includes("--jobs")) {
applyToJobs();
// } else {
// console.error(
// "Invalid arguments. Use '--jobs' or '--opportunity' to run the script."
// );
// }
