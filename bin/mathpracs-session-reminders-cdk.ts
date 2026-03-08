#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MathPracsSessionRemindersPipelineStack } from '../lib/mathpracs-session-reminders-pipeline-stack';

const app = new cdk.App();
new MathPracsSessionRemindersPipelineStack(app, 'MathPracsSessionRemindersPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
