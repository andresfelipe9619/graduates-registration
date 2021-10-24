const ROOT_FOLDER = 'Cena Gala';
const FILES_FOLDER = 'documentos';

function base64ToBlob(fileName, fileData) {
  const contentType = fileData.substring(5, fileData.indexOf(';'));
  const bytes = Utilities.base64Decode(
    fileData.substr(fileData.indexOf('base64,') + 7)
  );
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  return blob;
}

function findOrCreateFolder(name, folder2search) {
  let folder;
  const folders = folder2search.getFoldersByName(name);
  if (folders.hasNext()) folder = folders.next();
  else folder = folder2search.createFolder(name);
  return folder;
}

function getMainFolder() {
  const mainFolder = findOrCreateFolder(ROOT_FOLDER, DriveApp);
  return mainFolder;
}

function getFilesFolder(folder) {
  let mainFolder = folder;
  if (!folder) mainFolder = getMainFolder();

  const filesFolder = findOrCreateFolder(FILES_FOLDER, mainFolder);
  return filesFolder;
}

function createDriveFile({ id, folder, blob }) {
  const result = {
    url: '',
    name: '',
  };
  const file = folder.createFile(blob);
  file.setDescription("Subido Por " + id);
  file.setName(id + "_documento");
  result.url = file.getUrl();
  result.name = file.getName();
  return result;
}

function createStudentFolder(id, fileData) {
  const currentFolder = getFilesFolder();
  const blob = base64ToBlob(id, fileData);
  const result = createDriveFile({ id, blob, folder: currentFolder });
  return result;
}
