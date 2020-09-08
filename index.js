const yaml = require('js-yaml');
const Validator = require('./Validator');
const fs = require('fs');
const path = require('path');

function readFile(path) {
	return fs.readFileSync(path).toString();
}

function loadSchool(id) {
	let school = yaml.safeLoad(readFile(path.join(__dirname, `./${id}/school.yml`)));
	let schedule = yaml.safeLoad(readFile(path.join(__dirname, `./${id}/schedule.yml`)));

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

const obj = {
	mvhs: {
		name: 'Mountain View High School',
		...loadSchool('mvhs')
	},
	lahs: {
		name: 'Los Altos High School',
		...loadSchool('mvhs')	
	},
	paly: {
		name: 'Palo Alto High School',
		...loadSchool('paly')
	},
	montavista: {
		name: 'Monta Vista High School',
		...loadSchool('montavista')
	},
	lemanmiddle: {
		name: 'Leman Middle School',
		...loadSchool('lemanmiddle')
	},
	smhs: {
		name: 'San Marcos High School',
		...loadSchool('smhs')
	},
	blach: {
		name: 'Blach Intermediate School',
		...loadSchool('blach')
	},
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
