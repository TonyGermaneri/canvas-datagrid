import mocha from 'mocha';

export function MultiReporter(runner, options) {
  this.reports = [];
  if (!options.reporterOptions.reporters) {
    console.log(
      '\nneeds --reporter-options reporters="SPACE_SEPARATED_MOCHA_REPORTS"',
    );
    return;
  }
  let that = this;
  options.reporterOptions.reporters.split(' ').forEach(function (report) {
    let ReportClass = mocha.reporters[report];
    if (!ReportClass) {
      console.log(
        '\ninvalid report class available: ' +
          Object.keys(mocha.reporters).join(','),
      );
      return;
    }
    let reportInstance = new ReportClass(runner, options);
    that.reports.push(reportInstance);
  });
}
MultiReporter.prototype.epilogue = function () {
  this.reports.forEach(function (reportInstance) {
    reportInstance.epilogue();
  });
};
