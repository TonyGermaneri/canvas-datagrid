# Instructions for maintainers

## Releasing  a new version

To release a new version of canvas-datagrid, I've found that this order of steps works well:

1. Update the `CHANGELOG.md` file, with the new version number, date, and an overview of what's changed since the previous release. For example:

```
## 1.0.0 - 2025-06-01

### Added

- Big feature meriting 1.0.0 release (contributing-user-foo, #999)
```

2. Update the version number in `package.json`

```diff
{
  "name": "canvas-datagrid",
-  "version": "0.9.9",
+  "version": "1.0.0",
```

3. Commit `package.json` and `CHANGELOG.md` and any other files. (Although, really, to be releasing you should generally only commit _these_ files)
```
$ git commit -m "Release v1.0.0"
```
4. Tag this commit with the new version number, as in `package.json`. So if you're releasing a 1.0.0:

```
$ git tag -a v1.0.0 -m "Release v1.0.0"
$ git push origin --tags
```

Once you've pushed the tagged commit, the GitHub Actions CI pipeline will take care of releasing it to NPM. To see how that works, refer to `.github/workflows/release.yml`
