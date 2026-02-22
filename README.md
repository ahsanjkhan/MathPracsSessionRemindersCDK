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

### Prerequisites

1. **Have the MathPracsSessionRemindersLambda repository also setup in your project in addition to this repository**
2. **Install Node.js** (version 18 or later)
3. **Install AWS CLI** and configure with your credentials
4. **Install Finch** (Docker alternative for CDK Python bundling)
5. **Deploy MathPracsPaymentRemindersCDK and MathPracs-TutoringManagement-CDK stacks first** (this stack imports resources from them)

### Install Node.js
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20
```

#### Setup Finch

**macOS (using Homebrew):**
```bash
brew install finch
finch vm init
finch vm start
```

**Other platforms:** Follow instructions at https://github.com/runfinch/finch

#### Deploy the Stack

0. **Set Node JS Version:**
   ```bash
   node --version # should show 20.x
   nvm use 20 # switch to 20 if it does not
   node --version # verify that it shows 20.x now
   ```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Bootstrap CDK (first time only):**
   ```bash
   npx cdk bootstrap
   ```

3. **Deploy with Finch:**
   ```bash
   CDK_DOCKER=finch npx cdk deploy
   ```

#### Useful Commands

- `CDK_DOCKER=finch npx cdk diff` - Compare deployed stack with current state
- `CDK_DOCKER=finch npx cdk synth` - Emit the synthesized CloudFormation template
- `CDK_DOCKER=finch npx cdk deploy` - Deploy with Finch Docker support
- `CDK_DOCKER=finch npx cdk destroy` - Destroy the stack
- `finch vm status` - See Finch VM Status
- `finch vm stop` - Stop Finch VM

### Stack Dependencies

This stack imports the following from other stacks:
- **MathPracsPaymentRemindersCDK**: Twilio API Secrets
- **MathPracs-TutoringManagement-CDK**: Sessions and Students DynamoDB Tables

### EventBridge Automation

The stack includes an EventBridge rule that automatically triggers the Lambda every 3 minutes to check for upcoming sessions and send reminders.
