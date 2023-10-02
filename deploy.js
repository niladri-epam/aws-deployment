import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import { Construct, Stack } from "@aws-cdk/core";

export class StaticSite extends Construct {
  constructor(parent, name) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "EPAMNiladriStaticWebsite"
    );
    const siteBucket = new s3.Bucket(this, "EPAMNiladriStaticWebsite", {
      bucketName: "Aws-Epam-Bucket-Nil",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "epam-niladri-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              OriginAccessIdentity: cloudfrontOAI,
            },
          },
        ],
        behaviours: [
          {
            isDefaultBehavior: true,
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "epam-niladri", {
      sources: [s3deploy.Source.asset("")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
