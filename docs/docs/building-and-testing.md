---
title: Building and Testing
---

To install development dependencies (required to build or test):

```
npm install
```

To build production and debug versions:

```
npm run build
```

To build documentation:

```
npm run build:docs
```

To convert the JSDoc annotation to type definition files for TypeScript integration:

```
npm run build:types
```

To run tests. Note: Headless tests will mostly fail due to lack of headless canvas pixel detection support. Use VM testing or your browser.

```
npm test
```

### Windows 10 WSL Testing
*This is info for wsl version 1. v2 seems to be [different](https://dev.to/davelsan/comment/nnf5).*

- `CHROME_BIN` needs to be set to the location of your Google Chrome exe in Windows. (e.g. `/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe`)
   *in WSL, `export CHROME_BIN='path/to/chrome'`*
- Chrome needs access to [karma's temp folder](https://stackoverflow.com/a/56204265/292067).
  - Create a `tmp` folder on the same Windows drive as your repo.
  - set `TEMP` to a folder that exists on the same Windows drive as your repo. (matching capitalization probably matters)
    *in WSL, `export TEMP='/Temp/karma'`, if your repo is on drive C, then create folder C:\Temp\karma*
- `karma.conf.js` needs to be edited
  - Change the browser from `ChromeHeadless` to `Chrome`
  - Modify to run ChromeHeadless without sandboxing. This is not ideal, but it seems to be necessary in [WSL](https://github.com/microsoft/WSL/issues/3282) and [Linux containers](https://docs.travis-ci.com/user/chrome#sandboxing) ([see also](https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457))
    - Add a custom launcher
      ```
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
        }
      }
      ```
    - Change the browser from `ChromeHeadless` to `ChromeHeadlessNoSandbox`
