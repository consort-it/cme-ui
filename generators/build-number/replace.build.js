var replace = require('replace-in-file');
var buildVersion = process.argv[2] + ' - ' + new Date().toUTCString();
const options = {
  files: 'apps/cme-ui/src/environments/environment.prod.ts',
  from: /{BUILD_VERSION}/g,
  to: buildVersion,
  allowEmptyPaths: false
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + buildVersion);
  console.log('Changed files:', changedFiles);
} catch (error) {
  console.error('Error occurred:', error);
}
