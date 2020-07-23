const express = require("express");
const app = express();
const AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
const lambda = new AWS.Lambda();
const fs = require("fs");
const s3 = new AWS.S3();

const fileNames = ["example.pdf", "example2.pdf", "example3.pdf"];

app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile("index.html"));

app.get("/download", async (req, res) => {
  console.log("incoming request");
  try {
    const lambdaResponse = await lambda
      .invoke({
        FunctionName: "zipFilesFromS3",
        Payload: JSON.stringify({
          body: {
            fileNames,
          },
        }),
      })
      .promise();

    const s3Params = {
      Bucket: "upload-download-test-bucket/exampleFiles/zipped",
      Key: "archive.zip",
    };

    // SOLUTION 1 - no headers :/
    // return s3.getObject(s3Params).createReadStream().pipe(res);

    // SOLUTION 2
    return s3.headObject(s3Params, (err, headData) => {
      if (err) throw err;
      console.log(headData);
      const stream = s3.getObject(s3Params).createReadStream();
      stream.on("error", function error(err) {
        throw err;
      });

      res.header({
        "Content-Disposition": "attachment; filename=" + s3Params.Key,
        "Content-Type": headData.ContentType,
        "Content-Length": headData.ContentLength,
      });
      return stream.pipe(res);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log("Server listening on port 3000"));
