const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
const s3 = new AWS.S3();
const bucketName = "upload-download-test-bucket";
const lambda = new AWS.Lambda();
const fileNames = ["example.pdf", "example2.pdf", "example3.pdf"];

// const lambdaFunction = require("./lambda");

// Create params JSON for S3.createBucket
// const bucketParams = {
//   Bucket: bucketName,
// };

// call S3 to create the bucket
// s3.createBucket(bucketParams, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Bucket URL is ", data.Location);
//   }
// });

// const uploadFile = (fileName) => {
//   const file = fs.readFile(path.join(__dirname, fileName), (err, data) => {
//     if (err) throw err;

//     const params = {
//       Bucket: bucketName,
//       Key: fileName,
//       //   Body: JSON.stringify(data, null, 2)
//       Body: data,
//     };

//     s3.upload(params, (error, data) => {
//       if (error) {
//         console.log("s3 error");
//         console.log(error);
//         throw error;
//       }
//       console.log(data);
//       console.log("file uploaded at ", data.Location);
//     });
//   });
// };

// uploadFile("exampleFile2.jpg");

// const listObjects = () => {
//   const params = {
//     Bucket: bucketName,
//   };

//   s3.listObjects(params, (err, data) => {
//     if (err) throw err;
//     console.log(data.Contents);
//   });
// };

// listObjects();

// ############ LAMBDA ROLE SETUP
// const iam = new AWS.IAM();

// const ROLE = "FETCH_DATA_FROM_S3_ROLE";

// const myPolicy = {
//   Version: "2012-10-17",
//   Statement: [
//     {
//       Effect: "Allow",
//       Principal: {
//         Service: "lambda.amazonaws.com",
//       },
//       Action: "sts:AssumeRole",
//     },
//   ],
// };

// const createParams = {
//   AssumeRolePolicyDocument: JSON.stringify(myPolicy),
//   RoleName: ROLE,
// };

// const lambdaPolicyParams = {
//   PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaRole",
//   RoleName: ROLE,
// };

// iam.createRole(createParams, function (err, data) {
//   if (err) {
//     console.log(err, err.stack); // an error occurred
//   } else {
//     console.log("Role ARN is", data.Role.Arn); // successful response
//     iam.attachRolePolicy(lambdaPolicyParams, function (err, data) {
//       if (err) {
//         console.log(err, err.stack); // an error occurred
//       } else {
//         console.log("AWSLambdaRole policy attached"); // successful response
//         console.log(data);
//       }
//     });
//   }
// });

// returned role ARN is arn:aws:iam::757404671799:role/FETCH_DATA_FROM_S3_ROLE

// ############# LAMBDA SETUP
// Create the IAM service object

const zipFile = fs.readFileSync(path.join(__dirname, "lambda/lambda.zip"));

// const params = {
//   Code: {
//     ZipFile: zipFile,
//   },
//   FunctionName: "zipFilesFromS3",
//   Handler: "lambdaFunction.handler",
//   Role: "arn:aws:iam::757404671799:role/FETCH_DATA_FROM_S3_ROLE",
//   Runtime: "nodejs12.x",
//   Description:
//     "Lambda function that fetch data from s3, zips them and sends as one file",
// };

// lambda.createFunction(params, function (err, data) {
//   if (err) console.log(err);
//   // an error occurred
//   else console.log(data); // successful response
// });

// ----> Lambda ARN: 'arn:aws:lambda:eu-central-1:757404671799:function:zipFilesFromS3'

const updateFunctionCodeParams = {
  FunctionName: "zipFilesFromS3",
  ZipFile: zipFile,
};
const update = async () => {
  try {
    const response = await lambda
      .updateFunctionCode(updateFunctionCodeParams)
      .promise();
    console.log(response);
  } catch (error) {
    throw error;
  }
};
update();

// const updateFunctionConfigurationParams = {
//   FunctionName: "zipFilesFromS3",
//   Handler: "lambda.handler",
// };
// const update = async () => {
//   try {
//     const response = await lambda
//       .updateFunctionConfiguration(updateFunctionConfigurationParams)
//       .promise();
//     console.log(response);
//   } catch (error) {
//     throw error;
//   }
// };
// update();

// const invoke = async () => {
//   try {
//     const result = await lambda
//       .invoke({
//         FunctionName: "zipFilesFromS3",
//         Payload: JSON.stringify({
//           body: {
//             fileNames,
//           },
//         }),
//       })
//       .promise();
//     console.log(result);
//   } catch (error) {
//     throw error;
//   }
// };
// invoke();
