# Instructions for maintainers

## Releasing a new version

To release a new version of canvas-datagrid, I've found that this order of steps works well:

1. Update the `CHANGELOG.md` file, with the new version number, date, and an overview of what's changed since the previous release. For example:

```
## 1.0.0 - 2025-06-01

### Added

- Big feature meriting 1.0.0 release (contributing-user-foo, #999)
```

2. Commit this file

3. Run `npm version patch` or `npm version <version-number>`, but usually `patch` will suffice. This will update the package.json and package-lock.json files, commit them, and tag the commit with the new version number.

4. Push the commits with `git push`

5. Once you've pushed the tagged commit, the GitHub Actions CI pipeline will take care of releasing it to NPM. To see how that works, refer to `.github/workflows/release.yml`
