const yaml = require('js-yaml');
const Validator = require('./Validator');
const fs = require('fs');
const path = require('path');

function readFile(loc) {
	return fs.readFileSync(path.join(__dirname, loc)).toString();
}

function loadSchool(id) {
	let school = yaml.safeLoad(readFile(`./data/${id}/school.yml`));
	let schedule = yaml.safeLoad(readFile(`./data/${id}/schedule.yml`));

	let validator = new Validator(school, schedule);
	if (validator.hasErrors()) {
		console.error('errors found for: ' + id);
		console.error(validator.getErrors());
		throw "ScheduleError";
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

module.exports = obj;
