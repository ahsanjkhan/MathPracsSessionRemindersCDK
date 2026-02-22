import * as cdk from 'aws-cdk-lib';
import * as python from '@aws-cdk/aws-lambda-python-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  SESSION_REMINDERS_TABLE_NAME,
  SESSION_REMINDERS_TABLE_ID,
  SESSION_REMINDERS_LAMBDA_NAME,
  SESSION_REMINDERS_LAMBDA_ID,
  SESSION_REMINDERS_LAMBDA_RUNTIME,
  SESSION_REMINDERS_LAMBDA_ENTRY,
  SESSION_REMINDERS_LAMBDA_INDEX,
  SESSION_REMINDERS_LAMBDA_HANDLER,
  SESSION_REMINDERS_LAMBDA_TIMEOUT,
  SESSION_REMINDERS_LAMBDA_MEMORY_SIZE,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSION_REMINDERS_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSIONS_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_API_SECRETS_ARN,
  SESSION_REMINDERS_EVENTBRIDGE_RULE_NAME,
  SESSION_REMINDERS_EVENTBRIDGE_RULE_ID,
  SESSION_REMINDERS_EVENTBRIDGE_RULE_DESCRIPTION,
  SESSION_REMINDERS_EVENTBRIDGE_RULE_SCHEDULE_EXPRESSION,
  CFN_OUTPUT_SESSION_REMINDERS_TABLE_ID,
  CFN_OUTPUT_SESSION_REMINDERS_TABLE_DESCRIPTION,
  CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_ID,
  CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_DESCRIPTION
} from "../config/constants";

export class MathPracsSessionRemindersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for session reminders tracking
    const sessionRemindersTable = new dynamodb.Table(this, SESSION_REMINDERS_TABLE_ID, {
      tableName: SESSION_REMINDERS_TABLE_NAME,
      partitionKey: { name: 'uid', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Import resources from other stacks
    const sessionsTableArn = cdk.Fn.importValue('MathPracs-SessionsTable-Arn');
    const studentsTableArn = cdk.Fn.importValue('MathPracs-StudentsTable-Arn');
    const apiSecretsArn = cdk.Fn.importValue('MathPracs-ApiSecrets-Arn');

    // Session Reminders Lambda
    const sessionRemindersLambda = new python.PythonFunction(this, SESSION_REMINDERS_LAMBDA_ID, {
      functionName: SESSION_REMINDERS_LAMBDA_NAME,
      runtime: SESSION_REMINDERS_LAMBDA_RUNTIME,
      entry: SESSION_REMINDERS_LAMBDA_ENTRY,
      index: SESSION_REMINDERS_LAMBDA_INDEX,
      handler: SESSION_REMINDERS_LAMBDA_HANDLER,
      timeout: SESSION_REMINDERS_LAMBDA_TIMEOUT,
      memorySize: SESSION_REMINDERS_LAMBDA_MEMORY_SIZE,
    });

    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSION_REMINDERS_TABLE_NAME, sessionRemindersTable.tableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSIONS_TABLE_NAME, 'Sessions');
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_TABLE_NAME, 'Students');
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_API_SECRETS_ARN, apiSecretsArn);

    // Grant Lambda permissions
    sessionRemindersTable.grantReadWriteData(sessionRemindersLambda);

    // Grant read access to imported tables
    sessionRemindersLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:Query'],
      resources: [sessionsTableArn, studentsTableArn]
    }));

    // Grant read access to secrets
    sessionRemindersLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [apiSecretsArn]
    }));

    // EventBridge Rule - every 3 minutes
    const sessionRemindersScheduleRule = new events.Rule(this, SESSION_REMINDERS_EVENTBRIDGE_RULE_ID, {
      ruleName: SESSION_REMINDERS_EVENTBRIDGE_RULE_NAME,
      description: SESSION_REMINDERS_EVENTBRIDGE_RULE_DESCRIPTION,
      schedule: events.Schedule.expression(SESSION_REMINDERS_EVENTBRIDGE_RULE_SCHEDULE_EXPRESSION),
    });

    sessionRemindersScheduleRule.addTarget(new targets.LambdaFunction(sessionRemindersLambda));

    // Outputs
    new cdk.CfnOutput(this, CFN_OUTPUT_SESSION_REMINDERS_TABLE_ID, {
      value: sessionRemindersTable.tableName,
      description: CFN_OUTPUT_SESSION_REMINDERS_TABLE_DESCRIPTION
    });

    new cdk.CfnOutput(this, CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_ID, {
      value: sessionRemindersLambda.functionName,
      description: CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_DESCRIPTION
    });
  }
}
