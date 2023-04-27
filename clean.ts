import path from "path";
import { rm, writeFile } from "fs/promises";
import pc from "picocolors";
import inquirer from "inquirer";
import { getSnapshots } from "./lib/getSnapshots";

const prompt = inquirer.createPromptModule()<{ choice: string[] }>;

async function main() {
  const assumeYes = process.argv[2] == "--assume-yes";
  const snapshots = await getSnapshots();

  if (snapshots.length <= 2) {
    console.log(`${pc.green("done")} - already cleaned`);
    process.exit(0);
  }

  const choiceNames = snapshots.slice(2).map(snapshot => snapshot.name);

  const { choice } = assumeYes
    ? { choice: choiceNames }
    : await prompt({
        name: "choice",
        message: "Pick snapshots to delete",
        choices: choiceNames,
        type: "checkbox",
        default: choiceNames
      });

  for (const dir of choice) {
    await rm(path.join(process.cwd(), "data", dir), {
      recursive: true,
      force: true
    });
  }

  const index = snapshots
    .filter(snapshot => !choice.includes(snapshot.name))
    .map(snapshot => snapshot.name.replace(" (latest)", ""))
    .concat("")
    .join("\n");
  await writeFile(
    path.join(process.cwd(), "data/.prettierignore"),
    index,
    "utf-8"
  );

  console.log(`${pc.green("done")} - removed ${choice.length} snapshots`);
}

main();
