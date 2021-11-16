
# Contributing to canvas-datagrid

## Introduction

First of all, thank you so much for taking the time to contribute! 🎉👍🎈 The maintainers of this project have day jobs and other commitments, so our time is limited and we really welcome any help we can get!

![cat-cute](https://user-images.githubusercontent.com/950979/141787558-3ffe531d-7eaf-4615-b8ed-7eaf58dce067.gif)

This document describes some guidelines and best practices for contributing to canvas-datagrid. Before submitting a pull request, please make sure you've read this entire document, as it contains some helpful pointers and aims to save time and effort for both maintainers and contributors alike.

## Conventions

### Commit messages

Clear, concise commit messages make all the difference when submitting pull requests. When done properly, it allows maintainers to quickly understand the different components or aspects of the changes introduced by a pull request. Therefore, when writing commit messages, please adhere to the following guidelines:

- Use the present tense, so "Add feature" not "Added feature"
- Use the imperative: "Move cursor to..." not "Moves cursor to..."
- Limit the first line to 72 characters or less
- Larger commits may have large messages, but keep the first line short and expand in more detail in the following lines
- Reference issues and pull requests liberally after the first line

If you keep these in mind while writing your code, it becomes more natural to commit smaller and more coherent sets of changes instead of big-ball-of-mud commits, and it tends to help you structure the work into discrete steps. This one is hard to get right, and even experienced developers often end up mashing a bunch of unrelated changes together in a single commit (🙋🏻‍♂️), so don't feel bad if you have to commit several things at once, but try to keep it in mind.

### Pull requests

A good pull request makes it easy for a maintainer to review. This means the pull request clearly and succinctly describes the changes being introduced, provides a commit history that makes it easy to evaluate distinct sets of changes

#### Structuring commits in a pull requests

The best pull requests are made up of commits that are structured in such a way that each commit is a logical, coherent change. If you're submitting a bugfix, the pull request should only address one single issue. Do not group multiple bugs or issues into the same pull request. If you do group several issues in one pull request, it makes it exponentially harder for a maintainer to evaluate whether the proposed changes address the relevant issue(s). There are exceptions to this rule, but try to keep pull requests as lean and to the point as possible.


#### Tests

Pull requests with failing tests or without tests that cover the new or changed functionality will _not_ be reviewed. This sounds tough, but while we welcome your contribution, without proper tests it's very hard and/or time-consuming for maintainers to evaluate whether the changes do what they should. Often a simple test case or two is enough.

Run tests using:

```
npm test
```

Tests are located in `test/`. If you need help creating tests, please reach out to us on Slack.

#### Create an online example

If you can, setting up a demo of the changes in an online code editor like [repl.it](https://replit.com/) or [CodeSandbox](https://codesandbox.io/) would make all the difference. It then becomes a lot easier for maintainers to quickly check if everything's working as described, and your pull request will get reviewed and approved a lot faster. It's not a hard requirement, but it definitely helps to speed things along.

### Javascript code

All source code should be formatted using [prettier](https://prettier.io/) and checked using [eslint](https://eslint.org/). To format, run:

```
npm run format
```

Please ensure before submitting the pull request that eslint does not report any errors. To do this, run:

```
npm run lint
```

While not perfect, these two commands will catch most of the common issues. Any other issues are described below. Note: this is a work in progress, so please don't feel bad if we make note of something not mentioned here.

#### General background

The codebase for this project has been around for a number of years and is in need of some refactoring and cleaning up. While now the code is annotated using JSDoc to describe types, we would like to migrate this project to TypeScript and make use of its native type system for an improved developer experience and keeping documentation in sync. This is all to say, parts of the codebase need some work, so when making changes try to see if you can raise the general level of quality of the codebase.

#### Comments

- Do not leave commented out code. Either remove it, or refactor it. Old code hanging around in comments is nobody's idea of a good time, serves no purpose, and should be removed.
- Comments should describe _why_ not _how_. The _how_ should be clear by the code itself. If it's not, the code needs to be reworked until it can be made clear. Good comments describe _why_ a certain piece of code is present.

#### Assorted

- Please use descriptive variable names as much as possible
- Please use `const` and `let` over `var` (in that order)

## Thank you!

Thank you for reading — we appreciate it!

![FD3h0wFVIAAGDmj](https://user-images.githubusercontent.com/950979/141791902-e71d67b8-3359-4503-aaf8-ca48255b48f7.jpg)
