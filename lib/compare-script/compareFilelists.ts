export function compareFileLists(filesOld: string[], filesNew: string[]) {
  const res = {
    files: new Array<string>(),
    added: new Array<string>(),
    removed: new Array<string>()
  };

  let iOld = 0;
  let iNew = 0;
  while (filesOld[iOld] && filesNew[iNew]) {
    if (filesOld[iOld] == filesNew[iNew]) {
      res.files.push(filesOld[iOld]);
      iOld++;
      iNew++;
      continue;
    }

    if (filesNew.slice(iNew).findIndex(file => file == filesOld[iOld]) >= 0) {
      res.added.push(filesNew[iNew]);
      iNew++;
      continue;
    }

    res.removed.push(filesOld[iOld]);
    iOld++;
    continue;
  }

  if (iOld < filesOld.length) {
    filesOld.slice(iOld).forEach(file => {
      res.removed.push(file);
    });
  }

  if (iNew < filesNew.length) {
    filesNew.slice(iNew).forEach(file => {
      res.added.push(file);
    });
  }

  return res;
}
