const AWS = require("aws-sdk");
const util = require("util");
const s3 = new AWS.S3();
const archiver = require("archiver");

const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});
archive.on("error", function (err) {
  throw err;
});

module.exports = {
  handler: async (event) => {
    console.log(
      "Reading options from event:\n",
      util.inspect(event, { depth: 5 })
    );
    const srcBucket = "upload-download-test-bucket";
    // const srcKey = event.body.fileName;
    const { fileNames } = event.body;

    try {
      fileNames.forEach(async (fileName) => {
        const s3File = await s3
          .getObject({
            Bucket: srcBucket,
            Key: fileName,
          })
          .promise();
        archive.file(s3File);
      });
      archive.finalize();
      const putResponse = await s3.putObject({
        Bucket: srcBucket,
        Key: `archive.zip`,
        Body: Buffer.from(archive),
      });
      // const params = {
      //   Bucket: srcBucket,
      //   Key: srcKey,
      // };
      // const s3File = await s3.getObject(params).promise();
      // const copy = await s3.putObject({
      //   Bucket: srcBucket,
      //   Key: `copy-${srcKey}`,
      // });
      return {
        statusCode: 200,
        message: "success",
        putResponse,
      };
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
