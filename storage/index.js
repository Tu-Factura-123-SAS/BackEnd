module.exports = async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

  console.log(fileBucket);
  console.log(filePath);
  console.log(contentType);
  console.log(metageneration);
};
