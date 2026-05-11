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
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_STUDENTS_METADATA_TABLE_NAME = 'STUDENTS_METADATA_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_TABLE_NAME = 'TUTORS_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_TUTORS_METADATA_TABLE_NAME = 'TUTORS_METADATA_TABLE_NAME';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN = 'DISCORD_SECRETS_ARN';
export const SESSION_REMINDERS_LAMBDA_ENV_VAR_KEY_API_SECRETS_ARN = 'SECRETS_ARN';

export const SESSION_REMINDERS_EVENTBRIDGE_RULE_NAME = 'mathpracs-session-reminders-schedule';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_ID = 'SessionRemindersSchedule';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_DESCRIPTION = 'Triggers session reminder Lambda every 3 minutes';
export const SESSION_REMINDERS_EVENTBRIDGE_RULE_SCHEDULE_EXPRESSION = 'rate(3 minutes)';

export const CFN_OUTPUT_SESSION_REMINDERS_TABLE_ID = 'SessionRemindersTableName';
export const CFN_OUTPUT_SESSION_REMINDERS_TABLE_DESCRIPTION = 'DynamoDB table name for session reminders';

export const CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_ID = 'SessionRemindersLambdaFunctionName';
export const CFN_OUTPUT_SESSION_REMINDERS_LAMBDA_DESCRIPTION = 'Session reminders Lambda function name';

// Alarm Notifier Lambda
export const ALARM_NOTIFIER_LAMBDA_NAME = 'mathpracs-session-reminders-alarm-notifier';
export const ALARM_NOTIFIER_LAMBDA_ID = 'AlarmNotifierFunction';
export const ALARM_NOTIFIER_LAMBDA_RUNTIME = lambda.Runtime.PYTHON_3_10;
export const ALARM_NOTIFIER_LAMBDA_ENTRY = '../MathPracsSessionRemindersLambda/alarm_notifier';
export const ALARM_NOTIFIER_LAMBDA_INDEX = 'handler/lambda_function.py';
export const ALARM_NOTIFIER_LAMBDA_HANDLER = 'lambda_handler';
export const ALARM_NOTIFIER_LAMBDA_TIMEOUT = cdk.Duration.seconds(30);
export const ALARM_NOTIFIER_LAMBDA_MEMORY_SIZE = 128;
export const ALARM_NOTIFIER_LAMBDA_ENV_VAR_KEY_DISCORD_SECRETS_ARN = 'DISCORD_SECRETS_ARN';

// SNS Topic
export const ALARM_SNS_TOPIC_NAME = 'mathpracs-session-reminders-alarms';
export const ALARM_SNS_TOPIC_ID = 'SessionRemindersAlarmTopic';

// CloudWatch Alarms
export const METRICS_NAMESPACE = 'MathPracs/SessionReminders';

export const ALARM_STUDENT_INFO_DDB_ID = 'StudentInfoDDBCompositeAlarm';
export const ALARM_STUDENT_INFO_DDB_NAME = 'mathpracs-session-reminders-student-info-ddb-composite';
export const ALARM_STUDENT_INFO_DDB_DESCRIPTION = 'Session Reminders: student data lookup failure';

export const ALARM_TUTOR_INFO_DDB_ID = 'TutorInfoDDBCompositeAlarm';
export const ALARM_TUTOR_INFO_DDB_NAME = 'mathpracs-session-reminders-tutor-info-ddb-composite';
export const ALARM_TUTOR_INFO_DDB_DESCRIPTION = 'Session Reminders: tutor data lookup failure';

export const ALARM_API_FAILURE_ID = 'APIFailureCompositeAlarm';
export const ALARM_API_FAILURE_NAME = 'mathpracs-session-reminders-api-failure-composite';
export const ALARM_API_FAILURE_DESCRIPTION = 'Session Reminders: external API call failure';

export const ALARM_UNKNOWN_FAILURES_ID = 'UnknownFailuresCompositeAlarm';
export const ALARM_UNKNOWN_FAILURES_NAME = 'mathpracs-session-reminders-unknown-failures-composite';
export const ALARM_UNKNOWN_FAILURES_DESCRIPTION = 'Session Reminders: unhandled exception in Lambda';
