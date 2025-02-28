const { spawn } = require("child_process");
const { exec } = require("child_process");
const { updateDashboard } = require("./dashboard");
const { randomDelay } = require("./utils/randomDelay");

const SCRIPTS = ["cutshort.js", "hirist.js", "InstaHyre.js", "naukri.js"];
const RESTART_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const COMMIT_INTERVAL = 10 * 60 * 1000; // 1 hour

let processes = [];

// Function to start scripts
async function startScripts() {
  console.log("Starting scripts...");
  await randomDelay();
  processes = SCRIPTS.map((script) => {
    const process = spawn("node", [`scripts/${script}`], { stdio: "inherit" });

    process.on("exit", (code) => {
      console.log(`Script ${script} exited with code ${code}`);
    });

    return process;
  });
}

// Function to stop scripts
function stopScripts() {
  console.log("Stopping scripts...");
  processes.forEach((proc) => proc.kill());
  processes = []; // Clear the process list after stopping
}

// Function to commit changes
function commitChanges() {
  updateDashboard(); // Update dashboard before committing

  exec(
    'git add . && git commit -m "Auto update job applications" && git push',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Git commit error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Git commit stderr: ${stderr}`);
        return;
      }
      console.log("Changes committed:", stdout);
    }
  );
}

// Handle process termination (CTRL+C or `kill` command)
function handleExit() {
  console.log("\nServer is shutting down... Cleaning up processes.");
  stopScripts(); // Ensure all spawned scripts are killed
  process.exit(0);
}

// Listen for termination signals
process.on("SIGINT", handleExit); // Handle CTRL+C
process.on("SIGTERM", handleExit); // Handle `kill` command

// Start scripts initially
startScripts();

// Restart scripts every 24 hours
setInterval(() => {
  stopScripts();
  setTimeout(startScripts, 5000);
}, RESTART_INTERVAL);

// Commit changes every 1 hour
setInterval(commitChanges, COMMIT_INTERVAL);
