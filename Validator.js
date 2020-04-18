
class Validator {
	constructor(school, schedule) {
		this.errors = {
			school: [],
			schedule: []
		}

		this.school = this.parseSchool(school);
		this.schedule = this.parseSchedule(schedule);

		this.validate();
		this.cleanup();
	}

	validate() {
		let mentions = new Set(this.schedule.defaults.pattern);
		mentions.forEach(p => {
			if (!this.school.presets[p])
				this.schoolError(`No preset "${p}" as mentioned in defaults`);
		});


		mentions = new Set(this.schedule.calendar.map(e => e.content.t));
		mentions.forEach(p => {
			if (!this.school.presets[p])
				this.schoolError(`No preset "${p}" as mentioned in calendar`);
		});
	}

	cleanup() {
		let mentions = new Set([...this.schedule.calendar.map(i => i.content.t), ...this.schedule.defaults.pattern]);
		for (let preset in this.school.presets)
			if (!mentions.has(preset))
				delete this.school.presets[preset];
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
						this.checkScheduleArray(school[key].schedule, key);

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

	checkScheduleArray(scheduleArr, presetName) {
		let last;
		for (let event of scheduleArr) {
			let time = Date.parse(`1/1/1970 ${event.substr(0, event.indexOf(' '))}`);
			if (isNaN(time)) {
				this.schoolError(`Preset "${presetName}" has an invalid schedule near (${event}). It was unable to parse the time of this event.`)
			}
			if (typeof last === 'number' && last >= time) {
				this.schoolError(`Preset "${presetName}" has an invalid schedule near (${event}). This error is due to the time/format of this line or surrounding lines. Please check that you are using 24 hour time.`);
			}
			last = time;
		}
	}

	parseSchedule(schedule) {
		schedule.calendar = this.parseCalendarArray(schedule.calendar);
		return schedule;
	}

	parseCalendarArray(arr) {
		let data = [];

		for (let each of arr)
			data.push(this.parseCalendarString(each));

		return data;
	}

	calStringSanCheck(str) {
		this.scheduleError(`Issue parsing schedule around (${str})`);
	}

	parseCalendarString(str) {
		let pieces = str.split('"');
		let n;

		// custom name; so remove that part
		if (pieces.length === 3) {
			str = pieces[0].trim();
			n = pieces[1];
		} else if (pieces.length > 1) // there shouldn't be one "
			this.calStringSanCheck(str);

		pieces = str.split(' ');
		if (pieces.length !== 2)
			this.calStringSanCheck(str);
		
		let t = pieces[1];
		let from, to, date;

		if (pieces[0].includes('-')) {
			pieces = pieces[0].split('-');
			from = pieces[0];
			to = pieces[1];

			if (pieces.length !== 2 || isNaN(Date.parse(from)) || isNaN(Date.parse(to))) this.calStringSanCheck(str);
		} else {
			date = pieces[0];
			if (isNaN(Date.parse(date))) this.calStringSanCheck(str);
		}

		return{
			date,
			from,
			to,
			content: {
				n,
				t
			}
		}
	}
}


module.exports = Validator;
