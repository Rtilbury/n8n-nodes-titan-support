# n8n-nodes-titan-support

This is an n8n community node. It lets you use **Titan AI Support** in your n8n workflows.

Titan AI Support is a deterministic error detection and recovery engine that identifies root causes, prioritises failures, and provides clear next-step guidance for AI workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

* [Installation](#installation)
* [Operations](#operations)
* [Credentials](#credentials)
* [Compatibility](#compatibility)
* [Usage](#usage)
* [Resources](#resources)
* [Version history](#version-history)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Or install directly:

```bash
npm install n8n-nodes-titan-support
```

---

## Operations

### Generate Support Analysis

Sends input (error, log, or payload) to Titan and returns a structured diagnostic response.

The response includes:

* Category (type of issue)
* Severity (impact level)
* Decision (recommended route and action)
* Confidence score
* Execution guard (safe to execute / autofix)
* Structured details (fields, corrections, cascade analysis)

---

## Credentials

You need a Titan API key.

### Setup

1. Create or obtain a Titan API key.
2. Add credentials in n8n:

   * Credential Type: `Titan API`
   * API Key: your Titan key

The node sends requests to:

```text
https://api.titan-api.com/v1/support/generate
```

---

## Compatibility

* Minimum n8n version: `1.0.0+`
* Tested with: `n8n v1.x`

---

## Usage

This node acts as a diagnostic and recovery layer inside your workflow.

Instead of just returning errors, Titan:

* Identifies the root cause
* Detects multiple linked failures (cascade detection)
* Tells you what to fix first
* Provides deterministic next-step guidance

### Two Ways to Use Titan

#### 1. Paste Error Mode (Fastest)

Send any error or log:

```json
{
  "error": "TypeError: Cannot read properties of undefined (reading 'name')"
}
```

Titan will:

* classify the issue
* explain what happened
* recommend what to do next

#### 2. Schema Validation Mode (Advanced)

Send structured payload + schema:

```json
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
```

Titan will:

* detect schema/type mismatches
* apply safe deterministic corrections
* return structured fix guidance

---

### Key Capability — Cascade Detection

Titan detects linked failures and prioritises them correctly.

Example:

```text
Malformed JSON → Runtime Error
```

Most systems show:

```text
Runtime Error
```

Titan shows:

```text
Primary: JSON Parse Error
Secondary: Runtime Error
```

Fix order:

1. Repair malformed JSON
2. Retry workflow
3. Investigate runtime failure only if it persists

---

### Supported Error Types

Titan handles real-world error patterns across:

* JSON parse errors (input and response)
* Schema mismatch and missing fields
* Runtime execution errors
* Authentication and credential errors
* Rate limits and quota issues
* Infrastructure / network / timeout failures
* Dependency / build errors (missing modules, failed imports)

---

### Example Output

#### Dependency Error

```text
Dependency Error
Severity: error

Fix this first:
Install or resolve the missing dependency, then rebuild and retry.
```

#### JSON Parse + Runtime Cascade

```text
JSON Parse Error
Severity: error

Fix this first:
Repair malformed JSON before addressing runtime failure.
```

---

### Input Flexibility

Titan accepts:

* Raw logs
* JSON payloads
* Mixed inputs (logs + payload)
* Plain-text error descriptions

Structured input improves precision, but is not required.

---

### Deterministic Behavior

Titan is deterministic:

* Same input → same output
* No probabilistic guessing
* No hallucinated fixes
* Safe execution guidance included

---

### AI Output Guard Workflow Template

An example n8n workflow template demonstrating Titan blocking malformed AI-generated content before downstream HTTP execution is included in:

```text
assets/n8n/titan-ai-output-guard-template.json
```

The workflow demonstrates:

* AI-output contamination detection
* Deterministic execution blocking
* Safe/unsafe routing
* Slack recovery alerts
* Downstream workflow protection

Example screenshots are available in:

```text
assets/n8n/
```

---

### Workflow Templates

Starter templates are included:

* `titan-ai-validation.json` — schema validation demo
* `titan-error-triage.json` — error classification
* `titan-manual-review-alert.json` — escalation handling
* `titan-ai-output-guard-template.json` — AI-output contamination detection and execution blocking

After importing:

1. Add credentials
2. Connect to Slack, email, or database nodes
3. Run the workflow

---

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* Titan API documentation (to be added)

---

## Version History

### 0.1.4 (Upcoming)

* Added dependency error detection
* Improved runtime vs JSON prioritisation
* Added cascade-aware fix ordering
* Introduced command-style “Fix this first” guidance
* Improved Slack output clarity
* Added AI-output contamination workflow template

### 0.1.3

* Published npm package with provenance
* Added telemetry marker
* Added workflow templates

### 0.1.0

* Initial release
* Deterministic triage support
* Structured audit output
