import { spawn } from "node:child_process";

const summary = {
  tests: 0,
  suites: 0,
  pass: 0,
  fail: 0,
  cancelled: 0,
  skipped: 0,
  todo: 0,
  durationMs: 0,
};

const summaryPatterns = [
  ["tests", /^# tests (\d+)$/],
  ["suites", /^# suites (\d+)$/],
  ["pass", /^# pass (\d+)$/],
  ["fail", /^# fail (\d+)$/],
  ["cancelled", /^# cancelled (\d+)$/],
  ["skipped", /^# skipped (\d+)$/],
  ["todo", /^# todo (\d+)$/],
  ["durationMs", /^# duration_ms ([\d.]+)$/],
];

const command = spawn(
  process.execPath,
  [
    "--experimental-specifier-resolution=node",
    "--test",
    "--test-reporter",
    "tap",
    "src/**/*.test.js",
  ],
  {
    cwd: new URL("..", import.meta.url),
    stdio: ["inherit", "pipe", "pipe"],
  },
);

const handleChunk = (chunk, targetStream) => {
  const text = chunk.toString();
  targetStream.write(text);

  for (const line of text.split(/\r?\n/)) {
    for (const [key, pattern] of summaryPatterns) {
      const match = line.match(pattern);
      if (match) {
        summary[key] = key === "durationMs" ? Number(match[1]) : Number.parseInt(match[1], 10);
      }
    }
  }
};

command.stdout.on("data", (chunk) => handleChunk(chunk, process.stdout));
command.stderr.on("data", (chunk) => handleChunk(chunk, process.stderr));

command.on("close", (code) => {
  const duration = summary.durationMs ? `${summary.durationMs.toFixed(2)} ms` : "n/a";

  console.log("");
  console.log("=== Test Summary ===");
  console.log(`Total tests: ${summary.tests}`);
  console.log(`Passed: ${summary.pass}`);
  console.log(`Failed: ${summary.fail}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Cancelled: ${summary.cancelled}`);
  console.log(`Todo: ${summary.todo}`);
  console.log(`Suites: ${summary.suites}`);
  console.log(`Duration: ${duration}`);

  process.exit(code ?? 1);
});
