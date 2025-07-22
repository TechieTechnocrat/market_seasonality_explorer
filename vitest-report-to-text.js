import fs from "fs";
import path from "path";

export default class CustomReporter {
  constructor() {
    this.allTasks = new Map(); // Use Map to store unique tasks by id
    this.failedBlocks = new Map(); // To store failed blocks by filename
    this.passesBlocks = new Map(); // To store passes blocks by filename
  }

  // Collect and accumulate all test updates
  onTaskUpdate(tasks) {
    tasks.forEach((task) => {
      this.allTasks.set(task.id, task);
    });
  }

  // Alternative: Use onFinished with the files parameter
  async onFinished(files) {
    const lines = [];

    // If files parameter is available, use it (more reliable)
    if (files && files.length > 0) {
      this.processFiles(files, lines);
    } else {
      // Fallback to accumulated tasks
      this.processTasks([...this.allTasks.values()], lines);
    }

    // Write to file
    const output = lines.join("\n");
    const outputPath = path.resolve("vitest-results.txt");

    try {
      fs.writeFileSync(outputPath, output, "utf-8");
      console.log(`\n✔ Test summary written to ${outputPath}`);
      console.log(`Total lines written: ${lines.length}`);
    } catch (error) {
      console.error("Error writing test results:", error);
    }
  }

  processFiles(files, lines) {
    files.forEach((file) => {
      if (file.tasks && file.tasks.length > 0) {
        this.processTasksRecursively(file.tasks, lines, []);
      }
    });

    // Output FAILED BLOCK and PASSES BLOCK by filenames
    this.failedBlocks.forEach((block, filename) => {
      lines.push(`FAILED BLOCK: ${filename}`);
      lines.push(block.join("\n"));
    });

    this.passesBlocks.forEach((block, filename) => {
      lines.push(`PASSES BLOCK: ${filename}`);
      lines.push(block.join("\n"));
    });
  }

  processTasks(tasks, lines) {
    const groupedByFilename = new Map();

    tasks.forEach((task) => {
      if (task.type === "test") {
        const suiteName = task.suite?.name || "Unknown Suite";
        const testName = task.name;
        const state = task.result?.state;
        const result =
          state === "pass" ? "Pass" : state === "fail" ? "Fail" : "Skipped";

        const description = `Describe: ${suiteName}`;
        const itStatement = `  it: ${testName} -> ${result}`;

        if (state === "fail") {
          if (!this.failedBlocks.has(suiteName)) {
            this.failedBlocks.set(suiteName, []);
          }
          this.failedBlocks
            .get(suiteName)
            .push(`${description} --> ${itStatement}`);
        } else {
          if (!this.passesBlocks.has(suiteName)) {
            this.passesBlocks.set(suiteName, []);
          }
          this.passesBlocks
            .get(suiteName)
            .push(`${description} --> ${itStatement}`);
        }
      }
    });
  }

  processTasksRecursively(tasks, lines, suiteStack) {
    tasks.forEach((task) => {
      if (task.type === "suite") {
        const currentSuite = [...suiteStack, task.name];
        lines.push(`Describe: ${task.name}`);

        // Process children recursively
        if (task.tasks && task.tasks.length > 0) {
          this.processTasksRecursively(task.tasks, lines, currentSuite);
        }

        // Check if suite failed/passed
        const suiteState = this.getSuiteState(task);
        if (suiteState) {
          lines.push(`  Suite Result: ${suiteState}`);
        }
      } else if (task.type === "test") {
        const state = task.result?.state;
        const result =
          state === "pass"
            ? "Pass"
            : state === "fail"
            ? "Fail"
            : state === "skip"
            ? "Skip"
            : "Unknown";

        lines.push(`  it: ${task.name} -> ${result}`);

        // Add error details if test failed
        if (state === "fail" && task.result?.errors?.length > 0) {
          const errorMsg = task.result.errors[0]?.message || "Unknown error";
          lines.push(`    Error: ${errorMsg.split("\n")[0]}`); // First line only
        }
      }
    });
  }

  getSuiteState(suite) {
    if (!suite.tasks || suite.tasks.length === 0) return null;

    const testTasks = this.getAllTestTasks(suite);
    const passed = testTasks.filter((t) => t.result?.state === "pass").length;
    const failed = testTasks.filter((t) => t.result?.state === "fail").length;
    const total = testTasks.length;

    if (total === 0) return null;
    if (failed === 0) return "All Pass";
    if (passed === 0) return "All Fail";
    return `${passed}/${total} Pass`;
  }

  getAllTestTasks(suite) {
    let tests = [];

    if (suite.tasks) {
      suite.tasks.forEach((task) => {
        if (task.type === "test") {
          tests.push(task);
        } else if (task.type === "suite") {
          tests = tests.concat(this.getAllTestTasks(task));
        }
      });
    }

    return tests;
  }
}
