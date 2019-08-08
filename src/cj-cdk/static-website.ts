import { Bucket } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";



export interface StaticWebsiteProps {

}

export class StaticWebsite extends Construct {
    constructor(scope: Construct, id: string, _props?: StaticWebsiteProps | undefined) {
        super(scope, id);

        // ?? do the ids need to be synthesized from the provided ID?
        // i'm thinking not because they get appended with arbitrary ids
        // (probably to solve just this problem)
        const contentStore = new Bucket(this, "ContentStore");

        new CloudFrontWebDistribution(this, "CDN", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: contentStore,
                    },
                    behaviors: [
                        {isDefaultBehavior: true},
                    ]
                }
            ]
        });
    }
}

