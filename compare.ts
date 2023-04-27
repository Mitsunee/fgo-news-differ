import pc from "picocolors";
import { readdir } from "fs/promises";
import { pickSnapshots } from "./lib/compare-script/pickSnapshots";
import { compareFileLists } from "./lib/compare-script/compareFilelists";
import { diffFiles } from "./lib/compare-script/diffFiles";
import { promptConfirm } from "./lib/promptConfirm";

async function getSortedFileList(dirPath: string) {
  const dir = await readdir(dirPath);
  dir.sort();
  return dir;
}

async function main() {
  const snapshots = await pickSnapshots();
  const [filesOld, filesNew] = await Promise.all(
    snapshots.map(snapshot => getSortedFileList(snapshot.path))
  );
  const fileListComparison = compareFileLists(filesOld, filesNew);

  for (const file of fileListComparison.removed) {
    console.log(`${pc.red("-")} ${file} - ${pc.red("removed")}`);
  }

  for (const file of fileListComparison.added) {
    console.log(`${pc.green("+")} ${file} - ${pc.green("added")}`);
  }

  for (const file of fileListComparison.files) {
    const diff = await diffFiles(file, snapshots);
    if (diff.length < 1) {
      console.log(`~ ${file} - ${pc.gray("no changes")}`);
      continue;
    }

    console.log(`~ ${file} - ${diff.length} changes`);
    const show = await promptConfirm("Show diff");
    if (!show) continue;

    diff.forEach(change => {
      if (change.removed) {
        console.log(pc.red(`-${change.value.trimEnd()}`));
        return;
      }
      if (change.added) {
        console.log(pc.green(`+${change.value.trimEnd()}`));
        return;
      }
    });
  }
}

main();
