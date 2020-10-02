export function blobToFile(theBlob: Blob, fileName: string): File {
    const blob: any = new Blob([theBlob]);
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob as File;
}