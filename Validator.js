
class Validator {
	constructor(school, schedule) {
		this.errors = {
			school: [],
			schedule: []
		}

		school = this.parseSchool(school);
		schedule = this.parseSchedule(schedule);

		// validation
		for (let preset of schedule.defaults.pattern) {
			if (!school.presets[preset]) {
				this.schoolError(`No preset "${preset}" as mentioned in defaults`);
			}
		}

		for (let item of schedule.calendar) {
			if (!school.presets[item.content.t]) {
				this.schoolError(`No preset "${item.content.t}" as mentioned in calendar`);
			}
		}

		// cleanup
		let allMentionedPresets = [...schedule.calendar.map(i => i.content.t), ...schedule.defaults.pattern];
		for (let preset in school.presets) {
			if (!allMentionedPresets.includes(preset)) {
				delete school.presets[preset];
			}
		}

		this.school = school;
		this.schedule = schedule;
	}

	schoolError(text) {
		this.errors.school.push(text);
	}

	scheduleError(text) {
		this.errors.schedule.push(text);
	}

	areErrors() {
		return this.errors.school.length !== 0 || this.errors.schedule.length !== 0;
	}

	getErrors() {
		return this.errors;
	}

	getCleaned() {
		return {
			school: this.school,
			schedule: this.schedule
		}
	}

	parseSchool(school) {
		let obj = {
			periods: school.periods,
			presets: {}
		}
		delete school.periods;

		for (let key in school) {
			obj.presets[key] = {
				n: (() => {
					if (typeof school[key].name !== 'string') {
						this.schoolError(`Preset "${key}" does not have a valid name: a valid name must be a string`);
					}
					return school[key].name;
				})(),
				s: (() => {
					if (!school[key].schedule) {
						return [];
					} else if (school[key].schedule instanceof Array) {

						// check the schedule
						let last;
						for (let event of school[key].schedule) {
							let time = Date.parse(`1/1/1970 ${event.substr(0, event.indexOf(' '))}`);
							if (typeof last === 'number' && last > time) {
								this.schoolError(`Preset "${key}" has an invalid schedule near (${event}). This error is due to the time/format of this line or surrounding lines. Please check that you are using 24 hour time.`);
							}
							last = time;
						}

						return school[key].schedule.join(',');
					} else {
						this.schoolError(`Preset "${key}" does not have a valid schedule: a valid schedule must be either an array or null (~)`);
					}
				})()
			}
		}

		if (!(obj.periods instanceof Array)) {
			this.schoolError(`Unable to understand "periods"; they must be in the form of an array`);
		}

		return obj;
	}

	parseSchedule(schedule) {
		schedule.calendar = this.parseCalendarArray(schedule.calendar);
		return schedule;
	}

	parseCalendarArray(arr) {
		let data = [];

		for (let i = 0; i < arr.length; i++) {
			let pieces = arr[i].split('"');
			let n;

			if (pieces.length === 3) { // custom name
				arr[i] = pieces[0].trim();
				n = pieces[1];
			}

			pieces = arr[i].split(' ');
			let t = pieces[1];
			let from, to, date;

			if (pieces[0].includes('-')) {
				pieces = pieces[0].split('-');
				from = pieces[0];
				to = pieces[1];
			} else {
				date = pieces[0];
			}

			data.push({
				date,
				from,
				to,
				content: {
					n,
					t
				}
			});
		}

		return data;
	}
}


module.exports = Validator;
