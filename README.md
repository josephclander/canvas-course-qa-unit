# Canvas Course QA – Unit Level

**Unit level QA tests for validating Canvas course configuration and behaviour during development.**

This project helps Canvas course builders express expected course behaviour as test cases and verify that configuration stays correct as the course is built and updated.

## Why this exists

Canvas courses are often developed without formal testing. Configuration issues are usually caught late, through manual checks or stakeholder feedback.

This project provides a **lightweight unit testing layer** so expectations about course setup can be written down explicitly and checked as you work.

The focus is on correctness and clarity during development.

## Scope

This tool is designed for unit level validation of Canvas course configuration, including:

- Course settings
- Modules and module items
- Assignments and availability rules
- Visibility and grading behaviour
- It validates individual configuration units rather than full user journeys.

## How it works

- Canvas API responses are retrieved for specific resources
- Responses are represented as JSON
- Jest tests assert expected values and behaviour
- Failing tests indicate configuration drift or implementation mistakes
- The tests act as executable documentation of how a course is intended to behave.

## What “course” means here

In this project, a course refers to the collection of configurable items within a Canvas course, including modules, assignments, and related settings. It does not refer to the Canvas LMS platform itself.

## Installation

### Requirements

- `Node.js 18` or later
- Access to the `Canvas API`

### Setup

1. Clone the repository

```bash
git clone https://github.com/<your-username>/canvas-course-qa-unit.git
cd canvas-course-qa-unit
```

2. Install dependencies

```bash
npm install
```

3. Provide Canvas API access
   For now, API responses are stored locally as JSON. You can obtain these by calling the Canvas API (for example using Postman) and saving the responses into the `data/` directory.

## Usage

1. Update the JSON files in `data/` with the current course configuration.
2. Edit or add tests in `tests/` to reflect the behaviour you expect.
3. Run the test suite:

```bash
npm test
```

- Passing tests indicate the course matches the expected configuration.
- Failing tests indicate configuration differences that should be reviewed.

## Project structure

```bash
canvas-course-qa-unit/
├── data/
│   ├── courseDetails.json
│   ├── courseSettings.json
│
├── tests/
│   └── course.test.js
│
├── utils/
│   └── timezones.js
│
├── package.json
├── README.md
```

## Example test cases

Tests describe intent, not implementation details. For example:

- Course has an end date
- Course is not a blueprint
- Course uses the correct timezone
- Student discussions are disabled
- Viewing is restricted after the course end date

Each test represents a rule that should remain true as the course evolves.

## Authentication

Canvas environments vary in how authentication is handled.

This project supports:

- Personal access tokens (bearer tokens)
- OAuth2 client credentials (enterprise Canvas instances)

Authentication is abstracted so the same tests can run in different environments.

## Roadmap

- Planned improvements focus on reducing manual steps and expanding coverage.
- Replace manually saved API responses with native fetch
- Introduce a standard fetch layer with consistent naming, such as:
  - `courseDetails(courseId)`
  - `courseSettings(courseId)`
  - `modulesList(courseId)`
  - `moduleItems(courseId, moduleId)`
- Expand unit tests to cover modules and assignments
- Support multiple authentication strategies without changing tests

## Who this is for

- Canvas course builders with technical experience
- Developers working with Canvas APIs
- QA minded practitioners who want clearer guarantees during course development

## License

MIT
