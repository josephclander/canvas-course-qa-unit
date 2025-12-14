# Canvas Course QA – Unit Level

Unit-level QA tests for validating Canvas course configuration during development.

This project allows Canvas course builders to express expected course behaviour as structured configuration, and verify that the live course matches those expectations using automated tests.

It is designed to support correctness, consistency, and clarity while courses are being built and updated.

## Why this exists

Canvas courses are often developed without formal testing.

Configuration issues such as incorrect settings, visibility rules, or availability dates are typically discovered late through manual checks or stakeholder feedback.

This project introduces a lightweight unit-testing layer that:

- forces expectations to be written down explicitly
- checks configuration continuously as the course evolves
- surfaces mistakes early, while changes are still cheap to fix

The goal is not full QA automation, but confidence during course development.

## Scope

This tool focuses on unit-level validation of Canvas course configuration.

Current coverage includes:

- Course details
- Course settings

Planned extensions include:

- Modules and module items
- Assignments and availability rules
- Visibility and grading behaviour

This tool validates individual configuration units, not full learner journeys.

## How it works

At a high level:

- Course configuration is fetched live from the Canvas API
- Expected behaviour is defined in a structured config file
- Jest tests compare live values against expectations
- Failures indicate configuration drift or incorrect setup

Tests act as executable documentation of how a course is intended to behave.

## What “course” means here

In this project, a course refers to the collection of configurable items within a Canvas course:

- course details
- settings
- modules
- assignments

It does not refer to the Canvas LMS platform itself.

## Installation

### Requirements

- Node.js 18 or later
- Access to the Canvas API

### Setup

Clone the repository:

```bash
git clone https://github.com/josephclander/canvas-course-qa-unit.git
cd canvas-course-qa-unit
```

Install dependencies:

```bash
npm install
```

## Authentication

Canvas authentication varies by environment.

This project supports:

- Personal access tokens (bearer tokens)
- OAuth2 client credentials (enterprise Canvas instances)

Authentication is handled via environment variables.

An example file is provided:

```bash
.env.example
```

Copy it to `.env` and populate the required values for your environment.

## Course packs

Courses are organised into course packs.

Each course pack represents one Canvas course and contains:

- `config.json` – executable expectations used by tests
- `requirements.yml` – human-readable requirements and intent

Example structure:

```bash
course-packs/
├── index.json
├── example-course-1/
│   ├── config.json
│   └── requirements.yml
├── example-course-2/
│   ├── config.json
│   └── requirements.yml
```

### index.json

Maps Canvas course IDs to pack names:

```json
{
  "12408355": "example-course-1",
  "12503415": "example-course-2"
}
```

## Configuration (config.json)

Each course pack contains a `config.json` file describing expected behaviour.

Only fields you care about need to be specified.

Undefined expectations are ignored by tests.

## Requirements (requirements.yml)

Each course pack also includes a `requirements.yml` file.

This file is not executable.

It exists to:

- capture intent
- explain why decisions were made
- allow non-technical stakeholders to review requirements

## Running tests

Add your Canvas course ID parameter to execute tests on the associated Course Pack

```bash
npm run course <courseId>
```

## Project structure

```bash
canvas-course-qa-unit/
├── course-packs/
├── schemas/
├── tests/
├── tools/
├── utils/
├── .env
├── package.json
├── README.md
```

## License

MIT
