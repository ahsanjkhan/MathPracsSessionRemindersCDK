import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";

export const SESSION_REMINDERS_TABLE_NAME = 'mathpracs-session-reminders';
export const SESSION_REMINDERS_TABLE_ID = 'SessionRemindersTable';

export const SESSION_REMINDERS_LAMBDA_NAME = 'mathpracs-session-reminder';
export const SESSION_REMINDERS_LAMBDA_ID = 'SessionRemindersFunction';
export const SESSION_REMINDERS_LAMBDA_RUNTIME = lambda.Runtime.PYTHON_3_10;
export const SESSION_REMINDERS_LAMBDA_ENTRY = '../MathPracsSessionRemindersLambda/session_reminders';
export const SESSION_REMINDERS_LAMBDA_INDEX = 'handler/lambda_function.py';
export const SESSION_REMINDERS_LAMBDA_HANDLER = 'lambda_handler';
export const SESSION_REMINDERS_LAMBDA_TIMEOUT = cdk.Duration.minutes(5);
export const SESSION_REMINDERS_LAMBDA_MEMORY_SIZE = 512;
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSION_REMINDERS_TABLE_NAME = 'SESSION_REMINDERS_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_SESSIONS_TABLE_NAME = 'SESSIONS_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_TABLE_NAME = 'STUDENTS_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_API_SECRETS_ARN = 'SECRETS_ARN';

export const SESSION_REMINDERS_EVENTBRIDGE_RULE_NAME = 'mathpracs-session-reminders-schedule';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_ID = 'SessionRemindersSchedule';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_DESCRIPTION = 'Triggers session reminder Lambda every 3 minutes';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_SCHEDULE_EXPRESSION = 'rate(3 minutes)';

export const CFN_OUTPUT_SESSION_REMINDERS_TABLE_ID = 'SessionRemindersTableName';
export const CFN_OUTPUT_SESSION_REMINDERS_TABLE_DESCRIPTION = 'DynamoDB table name for session reminders';

export const CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_ID = 'SessionRemindersLambdaFunctionName';
export const CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_DESCRIPTION = 'Session reminders Lambda function name';
