// grabs the first file from a list of files
export const getFile = (files, filetypes) => {
  if (files && files.length > 0) {
    for (let index in files) {
      let file = files.item(index);
      if (filetypes.includes(file.type)) {
        // makes a url to the file
        file.url = URL.createObjectURL(file);
        return file
      }
    }
  }
};
