const Bluebird = require("bluebird");
const { randomDelay } = require("../utils/randomDelay");
const { keywords } = require("../profile/prodile");
const { saveFile } = require("../utils/saveJob");

Bluebird.config({
  cancellation: true,
  timeout: 300,
});

// Define headers for both requests
const headers = {
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkb21haW4iOiJoaXJpc3QudGVjaCIsImlkIjoiNDAxODAwMSIsInN0YXR1cyI6MSwidHlwZSI6MiwiZXhwaXJlIjoxNzM2OTY1Njg0fQ.YEOYFrHehsGosdF1zcTWF1rSH7r0BAI7XvQgDGGwUfs",
  Origin: "https://www.hirist.tech",
  Connection: "keep-alive",
  Referer: "https://www.hirist.tech/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  TE: "trailers",
};

// First API: Fetch job listings
async function fetchJobListings(page) {
  const url =
    "https://jobseeker-api.hirist.com/v2/jobfeed/4018001/v3/jobfeedjobs?pageNo=0&sort=date&loc=&minexp=0&maxexp=30&normal_ml=1&query=";
  try {
    const response = await Bluebird.resolve(
      fetch(url, { method: "GET", headers })
    );
    const data = await response.json();

    if (response.ok) {
      // console.log("Job Listings:", data);
      return data.jobs;
    } else {
      console.error("Error fetching job listings:", data);
    }
  } catch (error) {
    console.error("Fetch Job Listings Error:", error);
  }
}

// Second API: Apply for a job
async function applyForJob(jobId, refCode) {
  const url = `https://jobseeker-api.hirist.com/v2/job/${jobId}/apply`;
  const payload = {
    jobPos: "10",
    attachCoverletter: 0,
    via: "web",
    refId: "167",
    refText: "rl_br",
    assessmentCompleted: 0,
    resp: 0,
    pref: refCode,
  };

  try {
    const response = await Bluebird.resolve(
      fetch(url, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
      })
    );
    const data = await response.json();
    console.log("🚀 ~ applyForJob ~ data:", data);

    // if (response.ok) {
    //   console.log(`Successfully applied for job ID: ${jobId}`);
    // } else {
    //   console.error(`Error applying for job ID: ${jobId}`, data);
    // }
    return data;
  } catch (error) {
    console.error(`Apply for Job Error for job ID: ${jobId}`, error);
    return { success: 0 };
  }
}

const saveJobToFile = saveFile("Hirist-jobs_applied.json");

(async () => {
  console.log(">>> running hirist apply script");

  for (let i = 0; i < 100; i++) {
    const jobs = await fetchJobListings(i);

    if (jobs && jobs.length > 0) {
      for (const job of jobs) {
        {
          if (
            job.mandatoryTags.filter((doc) => keywords[doc.name]).length >= 1
          ) {
            const data = await applyForJob(job.id, job.refCode);
            if (
              data.message.includes(
                "You have reached the maximum limit of the job applications in a single day"
              )
            ) {
              console.log(">>> Breaking hirist script");
              return;
            }
            if (data.success === 1) {
              // Save the applied job to the file immediately
              saveJobToFile({
                companyName: job.companyData.companyName,
                jobId: job.id,
                title: job.title,
              });
              console.log(
                `Applying for Job ID: ${job.id}, Title: ${job.title}, company: ${job.companyData.companyName}`
              );
              await randomDelay(); // Add random delay before applying
              // await applyForJob(job.id, job.refCode);
            }
          } else {
            console.log("Not applying for jobId", job.id);
          }
        }
      }
    } else {
      console.log("No jobs found to apply.");
      break;
    }
    await randomDelay();
  }
})();
