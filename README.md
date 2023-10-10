# Repository Rules and Regulations

## Technologies Used

- Next.js
- Material-UI
- Formik
- React Query
- Axios
- Nest
- Redis
- Prisma
- Swagger
- MySQL
- Nx

## Introduction

This document outlines the rules and regulations for working with our Git repositories. These rules are designed to maintain the integrity of our codebase and ensure a smooth development process.

## Branch Naming Convention

- All branches must be prefixed with the name of the project in kebab_case (using underscores as separators, no capital letters).
  - Example: `lynkr_landing`

## Types of Branches

### Main Feature Branch

- The main feature branch pertains to a key feature of the project.
- Example: `lynkr_landing` is the main feature branch for the landing page of Lynkr.
- This branch is considered "done" when the associated feature is completed and ready for staging.

### Task Feature Branch

- The task feature branch pertains to subtasks required for a main feature to be completed.
- Example: `lynkr_landing_hero_section`
- These branches are used to work on smaller elements, making code review easier and code changes more manageable.

## Workflow

1. **Creating Branches**
   - Before starting any work, create a GitHub issue that describes the task or feature to be worked on.
   - Main feature tasks should reference the main feature branch's name.
   - Task feature branches should reference their associated main feature using the issue number in their description.

2. **Working on Tasks**
   - Developers should work on their assigned task feature branches.
   - All commits must be done using "better-commits," referencing the relevant parts of the code.

3. **Pull Requests**
   - After completing a task, submit a merge request to the main feature branch.
   - Tag either Marco (for backend tasks) or Lorrain (for frontend tasks) as the reviewer.
   - Post a message in the group with a link to the pull request for review.
   - For beginners, wait for PR validation before moving on to the next task to ensure feedback and learning.

4. **Validation and Merging**
   - Only Marco and Lorrain have the right to validate and merge PRs into main feature branches, develop, or master branches.
   - Commits should be atomic, with each commit representing a single code change, facilitating easier review.

## GitHub Issues

- Every task or feature must be associated with a GitHub issue.
- GitHub issues should be created before starting work to facilitate task and commit tracking.

## Setup

### Windows

1. Clone the repository:
  ```git clone https://github.com/glom-oss/glom.git```

2. Change to the project directory:
  ```cd glom```

3. Install dependencies:
  ```npm install```

4. Create a .env file by following the .env.lynkr.skeleton template.

5. Start an application using Nx:
  ```npx nx serve <app name>``` Replace <app name> with the name of your specific application.


## Conclusion

These rules and regulations are in place to ensure the efficient and organized development of our projects. Adhering to these guidelines will help us maintain code quality and a smooth development process.
