const mongoose = require('mongoose');
const config = require('../config/database');

// Employee Schema
const EmployeeSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	patronymic: {
		type: String,
		required: true
	},
	birthDate: {
		type: {
			day: {
				type: Number,
				min: 1,
				max: 31
			},
			month: {
				type: Number,
				min: 1,
				max: 12
			},
			year: {
				type: Number
			},
		},
		required: true
	},
	position: {
		type: String,
		required: true
	},
	salary: {
		type: Number,
		required: true,
		min: 0
	}
});

const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);

module.exports.getEmployeeDyId = (id, callback) => {
	Employee.findById(id, (err, e) => {
		callback(err, {
			firstName: e.firstName,
			lastName: e.lastName,
			patronymic: e.patronymic,
			position: e.position,
			salary: e.salary,
			birthDate: e.birthDate,
			id: e._id
		});
	});
};
module.exports.createEmployee = (newEmployee, callback) => {
	newEmployee.save((err, employee) => {
		if (err) throw err;

		callback(err, {
			firstName: employee.firstName,
			lastName: employee.lastName,
			patronymic: employee.patronymic,
			position: employee.position,
			salary: employee.salary,
			birthDate: employee.birthDate,
			id: employee._id
		});
	});
};
module.exports.getEmployeeList = (callback) => {
	Employee.find({}, (err, employees) => {
		callback(err, employees.map(e => {
			return {
				firstName: e.firstName,
				lastName: e.lastName,
				patronymic: e.patronymic,
				position: e.position,
				salary: e.salary,
				birthDate: e.birthDate,
				id: e._id
			}
		}));
	});
};
module.exports.updateEmployee = (employee, callback) => {
	const query = {_id: employee.id};
	Employee.update(query, employee, (err, count, status) => {
		callback(err, status);
	});
};
module.exports.deleteEmployee = (id, callback) => {
	const query = {_id: id};
	Employee.remove(query, callback);
};
