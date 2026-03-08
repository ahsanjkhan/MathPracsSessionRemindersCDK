import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MathPracsSessionRemindersStack } from './mathpracs-session-reminders-stack';

export class MathPracsSessionRemindersStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);
    new MathPracsSessionRemindersStack(this, 'MathPracsSessionRemindersStack', {
      stackName: 'MathPracsSessionRemindersStack',
    });
  }
}
