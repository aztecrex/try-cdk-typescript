import { Bucket } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager';

export interface DomainProps {
    operationalDoman: string,
    vanityDomain?: string,
}

export interface StaticWebsiteProps {

    domain?: DomainProps,

}

class WebsiteCertificate extends Construct {
    constructor(scope: Construct, id: string, props?: DomainProps) {
        super(scope, id);

        if (props) {
            let namesConfig;
            if (props.vanityDomain) {
                namesConfig = {
                    domainName: props.vanityDomain,
                    subjectAlternativeNames: [props.operationalDoman],
                }
            } else {
                namesConfig = {
                    domainName: props.operationalDoman,
                    subjectAlternativeNames: [],
                }
            }
            new Certificate(this, "Cert", {
                ...namesConfig,
                validationMethod: ValidationMethod.DNS,
            });
        }

    }
}

export class StaticWebsite extends Construct {
    constructor(scope: Construct, id: string, props?: StaticWebsiteProps) {
        super(scope, id);

        const contentStore = new Bucket(this, "ContentStore");

        new WebsiteCertificate(this, "Domain", props && props.domain);

        new CloudFrontWebDistribution(this, "CDN", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: contentStore,
                    },
                    behaviors: [
                        { isDefaultBehavior: true },
                    ]
                }
            ],
        });
    }
}

