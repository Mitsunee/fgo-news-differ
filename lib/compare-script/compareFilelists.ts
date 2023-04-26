export function compareFileLists(filesOld: string[], filesNew: string[]) {
  let iOld = 0;
  let iNew = 0;
  while (filesOld[iOld] && filesNew[iNew]) {
    if (filesOld[iOld] == filesNew[iNew]) {
      console.log(`~ ${filesOld[iOld]}`);
      iOld++;
      iNew++;
      continue;
    }

    if (filesNew.slice(iNew).findIndex(file => file == filesOld[iOld]) >= 0) {
      console.log(`+ ${filesNew[iNew]} (file added)`);
      iNew++;
      continue;
    }

    console.log(`- ${filesOld[iOld]} (file removed)`);
    iOld++;
    continue;
  }

  if (iOld < filesOld.length) {
    filesOld.slice(iOld).forEach(file => {
      console.log(`- ${file} (file removed)`);
    });
  }

  if (iNew < filesNew.length) {
    filesNew.slice(iNew).forEach(file => {
      console.log(`+ ${file} (file added)`);
    });
  }
}
