const fs = require("fs");
const path = require("path");

const JOBS_DIR = "json"; // Directory containing JSON files
const DATA_DIR = "data"; // Directory for daily markdown files
const today = new Date().toISOString().split("T")[0];
const todayFile = path.join(DATA_DIR, `${today}.md`);
const mainReadme = "README.md";

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Function to read and merge all job data
function readAllJobData() {
  let allJobs = [];
  const files = fs.readdirSync(JOBS_DIR);
  files.filter(file=>file.includes('applied')).forEach((file) => {
    const filePath = path.join(JOBS_DIR, file);
    try {
      let rawData = fs.readFileSync(filePath, "utf8");
      const platform = file.split("-")[0];
      const jobs = JSON.parse(rawData)
        .filter((job) => job.dateApplied?.split("T")[0] === today)
        .map((job) => ({ ...job, platform }));
      allJobs = allJobs.concat(jobs);
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  });

  return allJobs;
}

// Function to group jobs by company name, then by position, and finally by platform
function groupJobs(jobs) {
  return jobs.reduce((acc, job) => {
    if (!acc[job.companyName]) {
      acc[job.companyName] = {};
    }

    if (!acc[job.companyName][job.title]) {
      acc[job.companyName][job.title] = {};
    }

    if (!acc[job.companyName][job.title][job.platform]) {
      acc[job.companyName][job.title][job.platform] = [];
    }

    acc[job.companyName][job.title][job.platform].push(job);

    return acc;
  }, {});
}

// Function to calculate aggregated stats
function getAggregatedStats(jobs) {
  let platformCounts = {};
  let totalApplied = jobs.length;

  jobs.forEach((job) => {
    platformCounts[job.platform] = (platformCounts[job.platform] || 0) + 1;
  });

  return { totalApplied, platformCounts };
}

// Function to update the daily markdown file
function updateDailyReadme(groupedJobs, stats) {
  let content = `# Job Applications - ${today}\n\n`;
  content += `## 📊 Summary\n`;
  content += `- **Total Applied:** ${stats.totalApplied}\n`;

  for (const platform in stats.platformCounts) {
    content += `- **${platform}:** ${stats.platformCounts[platform]}\n`;
  }

  content += `\n---\n`;

  for (const company in groupedJobs) {
    const positions = Object.keys(groupedJobs[company]);
    
    if (positions.length === 1) {
      const position = positions[0];
      content += `### ${company} - ${position}\n\n`;
      content += "| Platform | Company | Position |\n|---------|----------|----------|\n";
      
      for (const platform in groupedJobs[company][position]) {
        groupedJobs[company][position][platform].forEach((job) => {
          content += `| ${platform} | ${job.companyName} | ${job.title} |\n`;
        });
      }
    } else {
      content += `## ${company}\n\n`;
      
      for (const position in groupedJobs[company]) {
        content += `### ${position}\n\n`;
        content += "| Platform | Company | Position |\n|---------|----------|----------|\n";
        
        for (const platform in groupedJobs[company][position]) {
          groupedJobs[company][position][platform].forEach((job) => {
            content += `| ${platform} | ${job.companyName} | ${job.title} |\n`;
          });
        }
      }
    }
  }

  fs.writeFileSync(todayFile, content);
  console.log(`Updated: ${todayFile}`);
}

// Function to update the main README
async function updateMainReadme(groupedJobs, stats) {
  let content = `# 📊 Job Application Tracker\n\n`;
  content += `### 📅 Today: ${today}\n\n`;

  // Aggregated summary
  content += `## 📊 Summary\n`;
  content += `- **Total Applied:** ${stats.totalApplied}\n`;

  for (const platform in stats.platformCounts) {
    content += `- **${platform}:** ${stats.platformCounts[platform]}\n`;
  }

  content += `\n---\n`;

  for (const company in groupedJobs) {
    const positions = Object.keys(groupedJobs[company]);

    if (positions.length === 1) {
      const position = positions[0];
      content += `### ${company} - ${position}\n\n`;
      content += "| Platform | Company | Position |\n|---------|----------|----------|\n";

      for (const platform in groupedJobs[company][position]) {
        groupedJobs[company][position][platform].forEach((job) => {
          content += `| ${platform} | ${job.companyName} | ${job.title} |\n`;
        });
      }
    } else {
      content += `## ${company}\n\n`;

      for (const position in groupedJobs[company]) {
        content += `### ${position}\n\n`;
        content += "| Platform | Company | Position |\n|---------|----------|----------|\n";

        for (const platform in groupedJobs[company][position]) {
          groupedJobs[company][position][platform].forEach((job) => {
            content += `| ${platform} | ${job.companyName} | ${job.title} |\n`;
          });
        }
      }
    }
  }

  content += `\n## 📆 Past Records\n`;
  const files = fs.readdirSync(DATA_DIR).sort().reverse();
  files.forEach((file) => {
    const date = file.replace(".md", "");
    content += `- [${date}](data/${file})\n`;
  });

  fs.writeFileSync(mainReadme, content);
  console.log("Updated: README.md");
}

// Main function to update logs & dashboard
async function updateDashboard() {
  const jobs = readAllJobData();
  const groupedJobs = groupJobs(jobs);
  const stats = getAggregatedStats(jobs);
  updateDailyReadme(groupedJobs, stats);
  await updateMainReadme(groupedJobs, stats);
}

module.exports = { updateDashboard };

// Run the update function
updateDashboard();
