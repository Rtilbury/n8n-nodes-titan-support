# n8n-nodes-titan-support

This is an n8n community node. It lets you use **Titan AI Support** in your n8n workflows.

Titan AI Support is a deterministic error detection and recovery engine that identifies root causes, prioritises failures, and provides clear next-step guidance for AI workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Or install directly:

```bash
npm install n8n-nodes-titan-support
Operations
Generate Support Analysis

Sends input (error, log, or payload) to Titan and returns a structured diagnostic response.

The response includes:

Category (type of issue)
Severity (impact level)
Decision (recommended route and action)
Confidence score
Execution guard (safe to execute / autofix)
Structured details (fields, corrections, cascade analysis)
Credentials

You need a Titan API key.

Setup:
Create or obtain a Titan API key
Add credentials in n8n:
Credential Type: Titan API
API Key: your Titan key

The node sends requests to:

https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/support/generate
Compatibility
Minimum n8n version: 1.0.0+
Tested with: n8n v1.x
Usage

This node acts as a diagnostic and recovery layer inside your workflow.

Instead of just returning errors, Titan:

Identifies the root cause
Detects multiple linked failures (cascade)
Tells you what to fix first
Provides deterministic next steps
Two Ways to Use Titan
1. Paste Error Mode (fastest)

Send any error or log:

{
  "error": "TypeError: Cannot read properties of undefined (reading 'name')"
}

Titan will:

classify the issue
explain what happened
recommend what to do next
2. Schema Validation Mode (advanced)

Send structured payload + schema:

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
Key Capability — Cascade Detection

Titan detects linked failures and prioritises them correctly.

Example:

Malformed JSON → Runtime Error

Most systems show:

Runtime Error ❌

Titan shows:

Primary: JSON Parse Error
Secondary: Runtime Error

Fix this first:
1. Repair JSON
2. Retry workflow
3. Only then investigate runtime error
Supported Error Types

Titan handles real-world error patterns across:

JSON parse errors (input and response)
Schema mismatch and missing fields
Runtime execution errors
Authentication and credential errors
Rate limits and quota issues
Infrastructure / network / timeout failures
Dependency / build errors (missing modules, failed imports)
Example Output
Dependency Error
Dependency Error
Severity: error

Fix this first:
Install or resolve the missing dependency, then rebuild and retry.
JSON Parse + Runtime Cascade
JSON Parse Error
Severity: error

Fix this first:
Repair malformed JSON before addressing runtime failure.
Input Flexibility

Titan accepts:

Raw logs
JSON payloads
Mixed inputs (logs + payload)
Plain-text error descriptions

Structured input improves precision, but is not required.

Deterministic Behavior

Titan is deterministic:

Same input → same output
No probabilistic guessing
No hallucinated fixes
Safe execution guidance included
Workflow Templates

Starter templates are included:

titan-ai-validation.json — schema validation demo
titan-error-triage.json — error classification
titan-manual-review-alert.json — escalation handling

After importing:

Add credentials
Connect to Slack / email / DB
Run the workflow
Resources
n8n community nodes documentation
Titan API documentation (to be added)
Version history
0.1.4 (Upcoming)
Added dependency error detection
Improved runtime vs JSON prioritisation
Added cascade-aware fix ordering
Introduced command-style “Fix this first” guidance
Improved Slack output clarity
0.1.3
Published npm package with provenance
Added telemetry marker
Added workflow templates
0.1.0
Initial release
Deterministic triage support
Structured audit output