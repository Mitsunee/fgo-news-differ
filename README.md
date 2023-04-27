# FGO News Differ

This repository contains bash and node scripts used to snapshot and diff the FGO News page

## Installation

Make sure your shell supports **bash**, **curl** and has access to an installation of **Node.js 16.x**+ as well as the **pnpm** package manager (either global install or corepack)

```sh
pnpm install
```

## Usage

This repository contains multiple scripts:

- `pnpm download` - downloads a new snapshot
- `pnpm compare` - used to compare snapshots. Use with `--latest` or as `pnpm compare:latest` to compare the two latest screenshots
- `pnpm clean` - used to delete old snapshots, will always keep the two latest snapshots. Use with `--assume-yes` or as `pnpm clean:force` to skip selection

### Snapshots

Snapshots are saved into `./data` using the current date and time as the directory name. `.prettierignore` is also used as a list of currently saved snapshots. Snapshots contain a copy of the index.html as well as all news posts linked on the first page as prettified html documents. Images are not saved at this time.

## LICENSE

The code in the repository is licensed under the [MIT License](LICENSE). This repository does not contain any game code or assets from Fate/Grand Order and merely uses publically available data. Licenses for dependencies can be viewed with `pnpm licenses list`.
