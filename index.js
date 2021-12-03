const yaml = require('js-yaml');
const Validator = require('./Validator');
const fs = require('fs');
const path = require('path');

const filesNeedFixing = [];

function readFile(loc) {
	return fs.readFileSync(path.join(__dirname, loc)).toString();
}

function listArr(arr) {
	for (let i = 0; i < arr.length; i++)
			console.log(`${i + 1}.`, arr[i]);
}

function printErrors(id, errs) {
	if (errs.school.length !== 0) {
		filesNeedFixing.push(`${id}/school.yml`);
		console.log(`\nThe following errors were found in ${id}/school.yml:`);
		listArr(errs.school);
	}
	if (errs.schedule.length !== 0) {
		filesNeedFixing.push(`${id}/schedule.yml`);
		console.log(`\nThe following errors were found in ${id}/schedule.yml:`);
		listArr(errs.schedule);
	}
}

function loadSchool(id) {
	let school = yaml.safeLoad(readFile(`./data/${id}/school.yml`));
	let schedule = yaml.safeLoad(readFile(`./data/${id}/schedule.yml`));

	let validator = new Validator(school, schedule);
	if (validator.hasErrors()) {
		printErrors(id, validator.getErrors());
		errorsExist = true;
	}

	return {
		school: JSON.stringify(validator.getCleaned().school),
		schedule: JSON.stringify(validator.getCleaned().schedule),
		periods: JSON.stringify(validator.getCleaned().school.periods)
	}
}

const directory = yaml.safeLoad(readFile('./data/directory.yml'));
const obj = {};
const validateAll = process.argv.includes('-ca') || process.argv.includes('--check-all');

for (let key in directory) {
	let folder = directory[key].folder ? directory[key].folder : key

	if (typeof directory[key].live === 'boolean' && !directory[key].live) {
		// doesn't add it but still checks for errors iff validateAll
		if (validateAll) loadSchool(folder);
		continue;
	}
	
	obj[key] = {
		name: directory[key].name,
		...loadSchool(folder)
	}
}

const schools = [];
for (let key in obj) {
  if (!obj.hasOwnProperty(key))
    continue;

  schools.push({
    n: obj[key].name,
    id: key
  });
}
obj.schools = schools;

if (filesNeedFixing.length !== 0) {
	console.log('\n\nValidation failed! The following files need to be fixed:')
	listArr(filesNeedFixing);
	console.log('\n');
	process.exit(0);
}

module.exports = obj;
