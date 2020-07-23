const AWS = require("aws-sdk");
const util = require("util");
const s3 = new AWS.S3();
const s3Archiver = require("lambda-s3-archiver");
const srcBucket = "upload-download-test-bucket";

module.exports = {
  handler: async (event) => {
    const { fileNames } = event.body;
    try {
      const result = await s3Archiver.archive(
        srcBucket,
        "exampleFiles",
        fileNames,
        "zipped/archive",
        "zip"
      );

      return JSON.stringify({
        statusCode: 200,
        result,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
