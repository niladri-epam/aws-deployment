import * as cdk from "@aws-cdk/core";
import { StaticSite } from "./deploy";

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent, name) {
    super(parent, name);

    new StaticSite(this, "EPAMNiladriStaticWebsite");
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "MyStaticWebsite");

app.synth();
