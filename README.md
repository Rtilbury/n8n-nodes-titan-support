# n8n-nodes-titan-support

This is an n8n community node that integrates **Titan AI Support** into your workflows.

Titan provides deterministic AI error triage, correction analysis, and structured audit output for AI-generated data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the official n8n guide:

https://docs.n8n.io/integrations/community-nodes/installation/

## Operations

### Generate Support Analysis

Sends input (error, payload, or JSON) to Titan and returns a structured response.

The response includes:

- `status` (title, category, severity)
- correction analysis (resolver)
- decision routing (next step)
- execution guidance
- `titan_audit` object (transformations, confidence, audit trail)

## Credentials

You need a Titan API key.

### Setup

Add your API key in the node credentials.

The node sends requests to:


https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/support/generate


## Compatibility

- Minimum n8n version: 1.0.0+
- Tested with: n8n v1.x

## Usage

This node acts as an AI output validation and triage layer inside workflows.

Typical use cases:

- Validate AI-generated JSON before execution
- Detect and correct safe schema/type mismatches
- Block unsafe or policy-flagged outputs
- Diagnose malformed input (JSON errors)
- Handle runtime or provider errors

## Example Scenarios

## Example Scenarios

Common workflow patterns include:

1. Clean Pass (valid input)
2. Schema Corrected (safe correction available)
3. Governance Stop (manual review required)
4. JSON Parse Error (invalid structure)
5. Runtime Error (execution failure)

These examples represent common categories of AI output issues. Titan can also handle mixed inputs, partial payloads, and more complex error conditions, returning a structured triage response.

## Resources

- https://docs.n8n.io/integrations/community-nodes/
- Titan API documentation (to be added)

## Version history

### 0.1.0

- Initial release
- Deterministic triage support
- Structured audit output (`titan_audit`)

## Feedback & Issues

If Titan misclassifies an error, fails to detect a pattern, or you have a workflow suggestion, please open an issue:

https://github.com/Rtilbury/n8n-nodes-titan-support/issues

This helps improve deterministic detection and real-world workflow coverage.