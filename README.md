### What Is This

This is the Infrastructure-as-Code of an AWS Micro Service which processes automated session text message reminders for students enrolled in tutoring with MathPracs.

You can learn more about MathPracs at https://mathpracs.com

### How Does It Work

This uses the power of AWS Cloud Development Kit (CDK) to create the following infrastructure:

1. AWS Lambda Function - https://github.com/ahsanjkhan/MathPracsSessionRemindersLambda
2. AWS DynamoDB Table
3. AWS EventBridge Scheduler
4. Cross-stack imports from MathPracsPaymentRemindersCDK (Twilio API Secrets) and MathPracs-TutoringManagement-CDK (Sessions and Students tables)

### What Are The Components

AWS Lambda, AWS DynamoDB, AWS EventBridge Scheduler, AWS SecretsManager, Twilio API.

### How To Deploy

Raising a Pull Request for commits on a feature branch, getting it approved, and squashing and merging into `main` on either this repo or [MathPracsSessionRemindersLambda](https://github.com/ahsanjkhan/MathPracsSessionRemindersLambda) automatically triggers the CodePipeline, which runs deploys the changes.


#### First-Time Setup

1. **Install Node.js** (version 20), **AWS CLI**, and **Finch** (`brew install finch && finch vm init && finch vm start`)
2. **Bootstrap CDK:** `npx cdk bootstrap`
3. **Deploy the pipeline stack:**
   ```bash
   npm install
   CDK_DOCKER=finch npx cdk deploy MathPracsSessionRemindersPipelineStack
   ```

After this, all future changes are deployed automatically via the pipeline.

#### Manual Deployments (Avoid if possible)
1. Make changes on feature branch.
2. Commit those changes and raise Pull Request as usual.
3. Deploy the changes directly:
   ```bash
   CDK_DOCKER=finch npx cdk deploy MathPracsSessionRemindersStack
   ```

#### Useful Commands

- `CDK_DOCKER=finch npx cdk diff` - Compare deployed stack with current state
- `CDK_DOCKER=finch npx cdk synth` - Emit the synthesized CloudFormation template
- `CDK_DOCKER=finch npx cdk deploy` - Deploy with Finch Docker support
- `CDK_DOCKER=finch npx cdk destroy` - Destroy the stack # DANGEROUS!!
- `finch vm status` - See Finch VM Status
- `finch vm stop` - Stop Finch VM

### Stack Dependencies

This stack imports the following from other stacks:
- **MathPracsPaymentRemindersCDK**: Twilio API Secrets
- **MathPracs-TutoringManagement-CDK**: Sessions and Students DynamoDB Tables

### EventBridge Automation

The stack includes an EventBridge rule that automatically triggers the Lambda every 3 minutes to check for upcoming sessions and send reminders.
