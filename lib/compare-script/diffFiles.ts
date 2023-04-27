import path from "path";
import { diffLines } from "diff";
import { readFile } from "fs/promises";
import type { Snapshot } from "../getSnapshots";

export async function diffFiles(
  fileName: string,
  snapshots: [Snapshot, Snapshot]
) {
  const [fileOld, fileNew] = await Promise.all([
    readFile(path.join(snapshots[0].path, fileName), "utf-8"),
    readFile(path.join(snapshots[1].path, fileName), "utf-8")
  ]);

  const diff = diffLines(fileOld, fileNew);
  return diff.filter(change => change.added || change.removed);
}
