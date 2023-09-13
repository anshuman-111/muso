export const handleFileRenaming = (originalFile, filenameOnServer , setFilename) => {
    const extension = originalFile.name.split(".").pop();
    if (filenameOnServer === "display") {
        setFilename(filenameOnServer + "." + extension);
    }
  
    const newFile = new File(
        [originalFile],
        filenameOnServer + "." + extension,
        {
            type: originalFile.type,
        },
    );

    return newFile;
};