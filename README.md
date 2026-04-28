# n8n-nodes-titan-support

This is an n8n community node that integrates **Titan AI Support** into your workflows.

Titan provides deterministic AI error triage, correction analysis, and structured audit output for AI-generated data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

---

## Installation

Follow the official n8n guide:

https://docs.n8n.io/integrations/community-nodes/installation/

Or install directly:

```bash
npm install n8n-nodes-titan-support
Quick Start (2 minutes)
Install the node:
npm install n8n-nodes-titan-support
Import a starter workflow:
/templates/titan-ai-validation.json
Add your Titan API credentials
Run the workflow

Titan will return structured guidance showing whether the input was valid, fixable, blocked, or requires review.

Two Ways to Use Titan (Important)
1. Paste Error Mode (fastest)

Send any error, log, or message:

{
  "error": "TypeError: Cannot read properties of undefined (reading 'name')"
}

Titan will:

classify the issue
explain what happened
recommend next steps
2. Schema Validation Mode (advanced)

Send structured payload + expected schema:

{
  "error": "",
  "context": {
    "payload": {
      "name": 123
    },
    "expected_schema": {
      "name": "string"
    }
  }
}

Titan will:

detect schema/type mismatches
apply safe deterministic corrections
return structured fix guidance
Operations
Generate Support Analysis

Sends input (error or payload) to Titan and returns a structured response.

The response includes:

status (title, category, severity)
resolver (correction analysis)
decision (next step routing)
execution (guidance)
titan_audit (audit trail, transformations, confidence)
Workflow Templates

Starter templates are included in the /templates folder:

titan-ai-validation.json — schema validation and correction demo
titan-error-triage.json — paste-any-error classification
titan-manual-review-alert.json — manual review decision handling


These templates are intended as starting points. After import, add your Titan API credentials and adjust downstream actions such as Slack, email, or database logging.

Credentials

You need a Titan API key.

Add your API key in the Titan API credentials panel inside n8n.

The node sends requests to:

https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/support/generate
Usage

This node acts as an AI output validation and triage layer inside workflows.

Typical use cases:

Validate AI-generated JSON before execution
Detect and correct safe schema/type mismatches
Block unsafe or policy-flagged outputs
Diagnose malformed input (JSON errors)
Handle runtime or provider errors
Example Scenarios

Common workflow patterns include:

Clean Pass (valid input)
Schema Corrected (safe correction available)
Governance Stop (manual review required)
JSON Parse Error (invalid structure)
Runtime Error (execution failure)
Compatibility
Minimum n8n version: 1.0.0+
Tested with: n8n v1.x
Feedback & Issues

If Titan misclassifies an error, fails to detect a pattern, or you have a workflow suggestion, please open an issue:

https://github.com/Rtilbury/n8n-nodes-titan-support/issues

This helps improve deterministic detection and real-world workflow coverage.

Resources
https://docs.n8n.io/integrations/community-nodes/
Titan API documentation (to be added)
Version History
0.1.3
Published npm package with provenance
Added n8n usage telemetry marker
Added starter workflow templates
0.1.0
Initial release
Deterministic triage support
Structured audit output (titan_audit)