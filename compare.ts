import { readdir } from "fs/promises";
import { pickSnapshots } from "./lib/compare-script/pickSnapshots";
import { compareFileLists } from "./lib/compare-script/compareFilelists";

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
  //const filesDeleted = new Array<string>();
  //const filesAdded = new Array<string>();

  const fileListComparison = compareFileLists(filesOld, filesNew);
}

main();
