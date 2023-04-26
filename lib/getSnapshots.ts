import * as path from "path";
import { readdir } from "fs/promises";
import spacetime from "spacetime";

const dataDir = path.join(process.cwd(), "data");

export async function getSnapshots() {
  const dirContent = await readdir(dataDir, { withFileTypes: true });
  const snapshots = dirContent
    .filter(entry => {
      if (!entry.isDirectory()) return false;
      return /^\d{4}(-\d{2}){5}$/.test(entry.name);
    })
    .map(entry => {
      const match = entry.name.match(
        /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})-(?<hour>\d{2})-(?<minute>\d{2})-(?<second>\d{2})$/
      )!;
      const { year, month, day, hour, minute, second } = match.groups!;
      const s = spacetime([+year, +month - 1, +day, +hour, +minute, +second]);

      return {
        path: path.join(dataDir, entry.name),
        name: entry.name,
        s
      };
    });

  snapshots.sort((a, b) => {
    return b.s.epoch - a.s.epoch;
  });

  if (snapshots[0]) {
    snapshots[0].name += " (latest)";
  }

  return snapshots;
}

export type Snapshot = Awaited<ReturnType<typeof getSnapshots>>[number];
