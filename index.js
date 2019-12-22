const yaml = require('js-yaml');
const Validator = require('./Validator');
const fs = require('fs');

function loadSchool(id) {
	let school = yaml.safeLoad(fs.readFileSync(`./timing-data/${id}/school.yml`).toString());
	let schedule = yaml.safeLoad(fs.readFileSync(`./timing-data/${id}/schedule.yml`).toString());

	let validator = new Validator(school, schedule);
	if (validator.areErrors()) {
		console.log(id);
		throw JSON.stringify(validator.getErrors());
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