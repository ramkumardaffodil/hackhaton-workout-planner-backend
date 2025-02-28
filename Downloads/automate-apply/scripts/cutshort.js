const axios = require("axios");
const Bluebird = require("bluebird");
const { saveFile } = require("../utils/saveJob");

// Function to fetch jobs
function getHeaders(seekerSignalContext) {
  return {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-GB,en-IN;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    cookie:
      "USER_DATA=%7B%22attributes%22%3A%5B%7B%22key%22%3A%22USER_ATTRIBUTE_UNIQUE_ID%22%2C%22value%22%3A%226447882bd6303a0026041133%22%7D%5D%2C%22subscribedToOldSdk%22%3Afalse%2C%22deviceUuid%22%3A%22c99c0cdc-b134-4443-bfa5-1f5f1138f7c6%22%2C%22deviceAdded%22%3Atrue%7D; __stripe_mid=eb1a2153-b8b7-4223-9d89-4927bd3dfdc0de5458; SESSION=%7B%22sessionKey%22%3A%228791edf0-8aef-4346-b3fa-6d38ecc116ba%22%2C%22sessionStartTime%22%3A%222024-05-21T07%3A17%3A46.632Z%22%2C%22sessionMaxTime%22%3A1800%2C%22customIdentifiersToTrack%22%3A%5B%5D%2C%22sessionExpiryTime%22%3A1716279741190%2C%22numberOfSessions%22%3A2%2C%22currentSource%22%3A%7B%22source_url%22%3A%22https%3A%2F%2Fcutshort.io%2Fjob%2FFrontend-Developer-Angular-2-4-Pune-MedCords-mCIOEIt7%3Futm_source%3Dlinkedin-feed%26utm_medium%3Dxml%26utm_content%3Djob-posting%26applicationsource%3Dlinkedin-feed%22%2C%22source%22%3A%22linkedin-feed%22%2C%22medium%22%3A%22xml%22%2C%22content%22%3A%22job-posting%22%7D%7D; cutshort_authentication=s%3A9cDJ_rI2d_DYHZcjvrxZurG5_yBw_K74.Nmr0QRd83DJ5hxU2WjNgczmwf26iJT3b3AsoBzliOcE; _gcl_au=1.1.489332915.1730090799; _fbp=fb.1.1730090798750.253741212993514412; _lfa=LF1.1.37551d34cfa1c1d3.1716275703652; hubspotutk=fb3f0d76abae2a1574ab65b7008c0cf0; __hssrc=1; first_landed_on_page=https%3A%2F%2Fcutshort.io%2F; cssid=1730097742000ErXlt6SY; cutshortforprofessionals-_zldp=LGdsTi8yTOWmQAx4l28w2tqikEqFJ%2Fa%2BASFL%2BTFHQXuvAVUSyQDrbaJ0qlVfdpvHlfjNUTqTZOU%3D; cutshortforprofessionals-_zldt=0eb1193a-bb0d-417b-878c-58ecf1ade709-0; cs_sub_dom_id=lm2ma4INhYrOOb74; user_logged_in_once=true; NPS_70fac5bc_last_seen=1730097767819; NPS_70fac5bc_surveyed=true; last_url_params=%7B%22utm_campaign%22%3A%22google_jobs_apply%22%2C%22utm_source%22%3A%22google_jobs_apply%22%2C%22utm_medium%22%3A%22organic%22%7D; cs_fe_uuid=fded9c31-6260-48d2-9c23-8bd667abb0c1; _gid=GA1.2.412624869.1734366290; _clck=zwdg4n%7C2%7Cfrs%7C0%7C1762; _gat_UA-53592354-3=1; __hstc=118695254.fb3f0d76abae2a1574ab65b7008c0cf0.1730090799029.1734415240557.1734424760103.15; _clsk=1tokjl4%7C1734424761431%7C1%7C1%7Cr.clarity.ms%2Fcollect; XSRF-TOKEN=1CEPGIG4-9QsdMKnLgTfY-Gg1u8iQK-vOxAE; _ga_4M54T1S5KY=GS1.1.1734424760.15.1.1734424773.47.0.0; _ga_68L6VENFLX=GS1.1.1734424773.1.0.1734424773.0; _ga=GA1.1.70912695.1730090799; __hssc=118695254.2.1734424760103",
    priority: "u=1, i",
    referer: `https://cutshort.io/profile/all-jobs?matchesfor=${seekerSignalContext}`,
    "sec-ch-ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sentry-trace": "847551f2c4e94b87ab0ece8894212558-883c0fb925da6a7e-0",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };
}

async function fetchJobs(page, seekerSignalContext) {
  const url = `https://cutshort.io/findjobs/q?page=${page}&matchesfor=${seekerSignalContext}`;

  try {
    const response = await axios.get(url, {
      headers: getHeaders(seekerSignalContext),
    });
    console.log(`Fetched jobs for page ${page}`);
    return response.data.results; // Assumes JSON response
  } catch (error) {
    console.error(`Failed to fetch jobs for page ${page}`, error.message);
    throw error;
  }
}

const saveJobToFile = saveFile("CutShort-jobs_applied.json");

async function applyToJob(signalId, seekerSignalContext, jobDetail) {
  const payload = {
    signalid: signalId,
    message: "", // Add a custom message if needed
    seekerSignalContext: seekerSignalContext,
    type: "jobsignal",
    source: "all_jobs",
    urlParams: {
      matchesfor: signalId,
    },
  };

  try {
    const response = await axios.post(
      "https://cutshort.io/sendreply/jobsignal",
      payload,
      {
        headers: getHeaders(seekerSignalContext),
      }
    );
    saveJobToFile(jobDetail);
    console.log(`Successfully applied to job with Signal ID: ${signalId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to apply to job with Signal ID: ${signalId}`,
      error.message
    );
    // throw error;
  }
}

// Main function to fetch jobs and apply with rate limiting
(async () => {
  console.log(">>>> running cutshort script.");
  const seekerSignalContext = "64478a350550740027617b94";
  const concurrency = 1; // Number of simultaneous requests allowed
  const delayBetweenBatches = 1000; // Optional delay in ms between batches (1 second)

  try {
    const firstPageData = await fetchJobs(1, seekerSignalContext);

    const jobs = firstPageData;
    const totalPages = firstPageData.page_count || 3;

    // Fetch all jobs across pages
    const allJobs = await Bluebird.map(
      Array.from({ length: totalPages }, (_, i) => i + 1),
      async (page) => {
        console.log(`Processing page ${page}`);
        const jobs = await fetchJobs(page, seekerSignalContext);
        await Bluebird.delay(delayBetweenBatches); // Add delay between each batch of pages
        return jobs;
      },
      { concurrency }
    );

    // Flatten all job results into one array
    const flattenedJobs = allJobs.flat();

    // Apply to each job with controlled concurrency
    await Bluebird.map(
      flattenedJobs,
      async (job) => {
        console.log(`Applying for Job ID: ${job._id}, Title: ${job.company}`);
        await applyToJob(job._id, seekerSignalContext, {
          companyName: job.company,
          title: job.title,
        });
      },
      { concurrency }
    );

    console.log("All applications submitted!");
    console.log(">>>> Breaking cutsohrt script....");
  } catch (error) {
    console.error("Error in processing:", error.message);
  }
})();
