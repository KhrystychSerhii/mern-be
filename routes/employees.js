const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Employee = require('../models/employee');

// Create new employee
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { firstName, lastName, patronymic, birthDate, position, salary } = req.body;
	let newEmployee = new Employee({
		firstName,
		lastName,
		patronymic,
		birthDate,
		position,
		salary
	});
	Employee.createEmployee(newEmployee, (err, employee) => {
		if (err) {
			res.json({success: false, msg: 'Failed to create new employee.'});
		} else {
			res.json({success: true, msg: 'Employee created', employee });
		}
	});
});

// Get employees list
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	Employee.getEmployeeList((err, employees) => {
		if (err) {
			res.json({success: false, msg: 'Failed to get employees list'});
		} else {
			res.json({success: true, employees});
		}
	});
});

// Get employee by id
router.get('/employee/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { id } = req.params;
	if (!id) {
		res.json({success: false, msg: 'Id not found'});
	} else {
		Employee.getEmployeeDyId(id, (err, employee) => {
			if (err) {
				res.json({success: false, msg: `Failed to get employee by id ${id}`});
			} else {
				res.json({success: true, employee })
			}
		});
	}
});

router.put('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	Employee.updateEmployee(req.body, (err, status) => {
		if (err) {
			res.json({ success: false, msg: `Failed to update employee with id=${req.body}`});
		} else {
			res.json({ success: true, employee: req.body});
		}
	});
});

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { id } = req.params;
	Employee.deleteEmployee(id, (err, product) => {
		if (err) {
			res.json({ success: false, msg: `Failed to remove employee with id=${req.body}`});
		} else {
			res.json({ success: true, msg: 'Employee removed', id });
		}
	});
});

module.exports = router;