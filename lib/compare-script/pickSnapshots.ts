import { getSnapshots } from "../getSnapshots";
import type { Snapshot } from "../getSnapshots";

import inquirer from "inquirer";
const prompt = inquirer.createPromptModule()<{ choice: string }>;

export async function pickSnapshots(): Promise<[Snapshot, Snapshot]> {
  const snapshots = await getSnapshots();

  if (snapshots.length < 2) {
    console.error("There aren't enough snapshots for a comparison");
    process.exit(1);
  }

  let res: { choice: string } = await prompt({
    name: "choice",
    message: "Pick past snapshot",
    type: "list",
    choices: snapshots.map(snapshot => snapshot.name),
    default: 1
  });

  const idxA = snapshots.findIndex(snapshot => snapshot.name == res.choice);
  const [snapA] = snapshots.splice(idxA, 1);

  res = await prompt({
    name: "choice",
    message: "Pick new snapshot",
    type: "list",
    choices: snapshots.map(snapshot => snapshot.name)
  });

  const snapB = snapshots.find(snapshot => snapshot.name == res.choice)!;

  return [snapA, snapB];
}
