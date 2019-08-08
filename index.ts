import cdk = require('@aws-cdk/core');
import { StaticWebsite } from './src/cj-cdk/static-website';


export class FrontendStack extends cdk.Stack {
    constructor(app: cdk.App, id: string) {
        super(app, id);

        new StaticWebsite(this, "FooCJDev", {
            domain: {
                operationalDoman: "foo.ops.cjpowered.com",
                vanityDomain: "foo.cj.dev",
            }
        });

    }
}

const app = new cdk.App();
new FrontendStack(app, 'try-sdk-typescript-frontend');
app.synth();

