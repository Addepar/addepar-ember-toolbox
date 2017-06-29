/* eslint-env node */
module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "launch_in_ci": [
    "Chrome"
  ],
  "launch_in_dev": [
    "Chrome"
  ],
  "reporter": "xunit",
  "xunit_intermediate_output": true,
  "browser_start_timeout": 300,
  "report_file": "test-results.xml"
};
