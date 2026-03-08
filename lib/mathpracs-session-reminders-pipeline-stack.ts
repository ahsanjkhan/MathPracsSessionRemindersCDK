import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MathPracsSessionRemindersStage } from './mathpracs-session-reminders-stage';

const CDK_REPO = 'ahsanjkhan/MathPracsSessionRemindersCDK';
const LAMBDA_REPO = 'ahsanjkhan/MathPracsSessionRemindersLambda';
const MAIN_BRANCH = 'main';

export class MathPracsSessionRemindersPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const connectionArn = ssm.StringParameter.valueForStringParameter(this, '/mathpracs/github-connection-arn');

    const cdkSource = CodePipelineSource.connection(CDK_REPO, MAIN_BRANCH, {
      connectionArn,
      triggerOnPush: true,
    });

    const lambdaSource = CodePipelineSource.connection(LAMBDA_REPO, MAIN_BRANCH, {
      connectionArn,
      triggerOnPush: true,
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MathPracsSessionRemindersPipeline',
      pipelineType: codepipeline.PipelineType.V2,
      synth: new ShellStep('Synth', {
        input: cdkSource,
        additionalInputs: {
          '../MathPracsSessionRemindersLambda': lambdaSource,
        },
        commands: [
          'npm ci',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new MathPracsSessionRemindersStage(this, 'Prod', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }));
  }
}
