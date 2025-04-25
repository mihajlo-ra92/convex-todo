/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// Path to your .env.convex file
const envFilePath = path.join(process.cwd(), ".env.convex");

try {
  // Read the .env.convex file
  const envFileContent = fs.readFileSync(envFilePath, "utf8");

  // Parse the file content to extract key-value pairs
  const envVars = envFileContent
    .split("\n")
    .filter(
      (line) =>
        line.trim() !== "" && !line.startsWith("#") && line.includes("=")
    )
    .map((line) => {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      // Remove quotes if present
      return {
        key: key.trim(),
        value: value.replace(/^["'](.*)["']$/, "$1"),
      };
    });

  console.log(
    `Found ${envVars.length} environment variables in ${envFilePath}`
  );

  // Set each environment variable using the Convex CLI
  envVars.forEach(({ key, value }) => {
    try {
      console.log(`Setting ${key}...`);
      execSync(`npx convex env set ${key} "${value}"`, { stdio: "inherit" });
    } catch (error) {
      console.error(`Failed to set ${key}: ${error.message}`);
    }
  });

  console.log("Environment variables have been set successfully!");
} catch (error) {
  if (error.code === "ENOENT") {
    console.error(`Error: ${envFilePath} file not found.`);
  } else {
    console.error(`Error: ${error.message}`);
  }
  process.exit(1);
}
