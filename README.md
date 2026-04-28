# n8n-nodes-titan-support

This is an n8n community node that integrates **Titan AI Support** into your workflows.

Titan provides deterministic AI error triage, correction analysis, and structured audit output for AI-generated data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the official n8n guide:

https://docs.n8n.io/integrations/community-nodes/installation/

Or install directly:

```bash
npm install n8n-nodes-titan-support
Operations
Generate Support Analysis

Sends input (error, payload, or JSON) to Titan and returns a structured response.

The response includes:

status (title, category, severity)
correction analysis (resolver)
decision routing (next step)
execution guidance
titan_audit object (transformations, confidence, audit trail)
Credentials

You need a Titan API key.

Add your API key in the Titan API credentials panel inside n8n.

The node sends requests to:

https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/support/generate
Quick Start (2 minutes)
Install the node:
npm install n8n-nodes-titan-support
Import this workflow:
/templates/titan-ai-validation.json
Add your Titan API credentials.
Run the workflow and review the Titan response.

Titan will return structured guidance showing whether the input was valid, fixable, blocked, or requires review.

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

These examples represent common categories of AI output issues. Titan can also handle mixed inputs, partial payloads, and more complex error conditions, returning a structured triage response.

## Workflow Templates

Starter templates are included in the `/templates` folder:

- `titan-ai-validation.json` — validate AI output before it reaches the next workflow step
- `titan-manual-review-alert.json` — prepare a manual-review alert when Titan flags unsafe or uncertain output
- `titan-slack-rich-alert.json` — format a Slack-ready alert from Titan’s structured response

These templates are intended as starting points. After import, add your Titan API credentials and adjust downstream actions such as Slack, email, or database logging.

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
Version history
0.1.3
Published npm package with provenance
Added n8n usage telemetry marker
Added starter workflow template
0.1.0
Initial release
Deterministic triage support
Structured audit output (titan_audit)