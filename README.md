# Packaging

This repo uses [Bun](https://bun.sh), but other tools such as `npm` and `yarn` should work fine.

When you've made changes to the code you should always compile and format it. You do this by running `bun format && bun lint --fix && bun run build && bun package`. Replace `bun` with your desired tool (although `bun` is highly recommended).

# Contributing

[Contributing guidelines](CONTRIBUTING.md)

Submit your changes in a PR and add a reviewer. If you're unsure who to add, then you can add @juhlinus. Dont forget to make sure that all tests are passing locally, and that you've packaged the code properly (see above), before you submit a PR.
