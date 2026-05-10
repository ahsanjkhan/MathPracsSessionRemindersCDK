import * as cdk from 'aws-cdk-lib';
import * as python from '@aws-cdk/aws-lambda-python-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
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
  CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_DESCRIPTION,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_METADATA_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_METADATA_TABLE_NAME,
  SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN,
  ALARM_NOTIFIER_LAMBDA_NAME,
  ALARM_NOTIFIER_LAMBDA_ID,
  ALARM_NOTIFIER_LAMBDA_RUNTIME,
  ALARM_NOTIFIER_LAMBDA_ENTRY,
  ALARM_NOTIFIER_LAMBDA_INDEX,
  ALARM_NOTIFIER_LAMBDA_HANDLER,
  ALARM_NOTIFIER_LAMBDA_TIMEOUT,
  ALARM_NOTIFIER_LAMBDA_MEMORY_SIZE,
  ALARM_NOTIFIER_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN,
  ALARM_SNS_TOPIC_NAME,
  ALARM_SNS_TOPIC_ID,
  METRICS_NAMESPACE,
  ALARM_STUDENT_INFO_DDB_ID,
  ALARM_STUDENT_INFO_DDB_NAME,
  ALARM_STUDENT_INFO_DDB_DESCRIPTION,
  ALARM_TUTOR_INFO_DDB_ID,
  ALARM_TUTOR_INFO_DDB_NAME,
  ALARM_TUTOR_INFO_DDB_DESCRIPTION,
  ALARM_API_FAILURE_ID,
  ALARM_API_FAILURE_NAME,
  ALARM_API_FAILURE_DESCRIPTION,
  ALARM_UNKNOWN_FAILURES_ID,
  ALARM_UNKNOWN_FAILURES_NAME,
  ALARM_UNKNOWN_FAILURES_DESCRIPTION,
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
    const studentsV2TableArn = cdk.Fn.importValue('MathPracs-StudentsV2Table-Arn');
    const studentsMetadataV2TableArn = cdk.Fn.importValue('MathPracs-StudentsMetadataV2Table-Arn');
    const importedTutorsV2TableArn = cdk.Fn.importValue('MathPracs-TutorsV2Table-Arn');
    const importedTutorsMetadataV2TableArn = cdk.Fn.importValue('MathPracs-TutorsMetadataV2Table-Arn');
    const importedDiscordApiSecretsArn = cdk.Fn.importValue('MathPracs-DiscordCredentials-Arn');
    const apiSecretsArn = cdk.Fn.importValue('MathPracs-ApiSecrets-Arn');

    // Lookup tables and extract their names
    const importedSessionsTableName = dynamodb.Table.fromTableArn(this, 'SessionsTableName', sessionsTableArn).tableName;
    const importedStudentsV2TableName = dynamodb.Table.fromTableArn(this, 'StudentsV2TableName', studentsV2TableArn).tableName;
    const importedStudentsMetadataV2TableName = dynamodb.Table.fromTableArn(this, 'StudentsMetadataV2TableName', studentsMetadataV2TableArn).tableName;
    const importedTutorsV2TableName = dynamodb.Table.fromTableArn(this, 'TutorsV2TableName', importedTutorsV2TableArn).tableName;
    const importedTutorsMetadataV2TableName = dynamodb.Table.fromTableArn(this, 'TutorsMetadataV2TableName', importedTutorsMetadataV2TableArn).tableName;

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
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSIONS_TABLE_NAME, importedSessionsTableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_TABLE_NAME, importedStudentsV2TableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_METADATA_TABLE_NAME, importedStudentsMetadataV2TableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_TABLE_NAME, importedTutorsV2TableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_METADATA_TABLE_NAME, importedTutorsMetadataV2TableName);
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN, importedDiscordApiSecretsArn)
    sessionRemindersLambda.addEnvironment(SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_API_SECRETS_ARN, apiSecretsArn);

    // Grant Lambda permissions
    sessionRemindersTable.grantReadWriteData(sessionRemindersLambda);

    // Grant read access to imported tables
    sessionRemindersLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:Query'],
      resources: [
          sessionsTableArn,
          studentsV2TableArn,
          studentsMetadataV2TableArn,
          importedTutorsV2TableArn,
          importedTutorsMetadataV2TableArn
      ]
    }));

    // Grant read access to secrets
    sessionRemindersLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [
          importedDiscordApiSecretsArn,
          apiSecretsArn
      ]
    }));

    // EventBridge Rule - every 3 minutes
    const sessionRemindersScheduleRule = new events.Rule(this, SESSION_REMINDERS_EVENTBRIDGE_RULE_ID, {
      ruleName: SESSION_REMINDERS_EVENTBRIDGE_RULE_NAME,
      description: SESSION_REMINDERS_EVENTBRIDGE_RULE_DESCRIPTION,
      schedule: events.Schedule.expression(SESSION_REMINDERS_EVENTBRIDGE_RULE_SCHEDULE_EXPRESSION),
    });

    sessionRemindersScheduleRule.addTarget(new targets.LambdaFunction(sessionRemindersLambda));

    // Grant CloudWatch PutMetricData to session reminders Lambda
    sessionRemindersLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudwatch:PutMetricData'],
      resources: ['*'],
      conditions: {
        StringEquals: { 'cloudwatch:namespace': METRICS_NAMESPACE }
      }
    }));

    // SNS Topic for alarms
    const alarmTopic = new sns.Topic(this, ALARM_SNS_TOPIC_ID, {
      topicName: ALARM_SNS_TOPIC_NAME,
    });

    // Alarm Notifier Lambda
    const alarmNotifierLambda = new python.PythonFunction(this, ALARM_NOTIFIER_LAMBDA_ID, {
      functionName: ALARM_NOTIFIER_LAMBDA_NAME,
      runtime: ALARM_NOTIFIER_LAMBDA_RUNTIME,
      entry: ALARM_NOTIFIER_LAMBDA_ENTRY,
      index: ALARM_NOTIFIER_LAMBDA_INDEX,
      handler: ALARM_NOTIFIER_LAMBDA_HANDLER,
      timeout: ALARM_NOTIFIER_LAMBDA_TIMEOUT,
      memorySize: ALARM_NOTIFIER_LAMBDA_MEMORY_SIZE,
    });

    alarmNotifierLambda.addEnvironment(ALARM_NOTIFIER_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN, importedDiscordApiSecretsArn);

    alarmNotifierLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [importedDiscordApiSecretsArn]
    }));

    const alarmNotifierDlq = new sqs.Queue(this, 'AlarmNotifierDLQ', {
      queueName: 'mathpracs-session-reminders-alarm-notifier-dlq',
      retentionPeriod: cdk.Duration.days(14),
    });

    alarmTopic.addSubscription(new sns_subscriptions.LambdaSubscription(alarmNotifierLambda, {
      deadLetterQueue: alarmNotifierDlq,
    }));

    // CloudWatch Alarms
    const studentInfoDdbAlarm = new cloudwatch.Alarm(this, ALARM_STUDENT_INFO_DDB_ID, {
      alarmName: ALARM_STUDENT_INFO_DDB_NAME,
      alarmDescription: ALARM_STUDENT_INFO_DDB_DESCRIPTION,
      metric: new cloudwatch.Metric({
        namespace: METRICS_NAMESPACE,
        metricName: 'StudentInfoDDB',
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    studentInfoDdbAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    const tutorInfoDdbAlarm = new cloudwatch.Alarm(this, ALARM_TUTOR_INFO_DDB_ID, {
      alarmName: ALARM_TUTOR_INFO_DDB_NAME,
      alarmDescription: ALARM_TUTOR_INFO_DDB_DESCRIPTION,
      metric: new cloudwatch.Metric({
        namespace: METRICS_NAMESPACE,
        metricName: 'TutorInfoDDB',
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    tutorInfoDdbAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    const apiFailureAlarm = new cloudwatch.Alarm(this, ALARM_API_FAILURE_ID, {
      alarmName: ALARM_API_FAILURE_NAME,
      alarmDescription: ALARM_API_FAILURE_DESCRIPTION,
      metric: new cloudwatch.Metric({
        namespace: METRICS_NAMESPACE,
        metricName: 'APIFailure',
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    apiFailureAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    const unknownFailuresAlarm = new cloudwatch.Alarm(this, ALARM_UNKNOWN_FAILURES_ID, {
      alarmName: ALARM_UNKNOWN_FAILURES_NAME,
      alarmDescription: ALARM_UNKNOWN_FAILURES_DESCRIPTION,
      metric: new cloudwatch.Metric({
        namespace: METRICS_NAMESPACE,
        metricName: 'UnknownFailures',
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    unknownFailuresAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

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
