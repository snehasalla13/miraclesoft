var mongoose = require('mongoose');
var studentSchema = mongoose.Schema({
 _id: {
 type: String,
 required: true
 }
sName: {
 type: String,
 required: true
 },
 sEmail: {
 type: String,
 required: true
 },
 sPhoneNumber: {
 type: String,
 required: true
 },
 sAddress: {
 type: String,
 required: true
 },
 sDepartment: {
 type: String,
 required: true
 },
 create_date: {
   type: Date,
 default: Date.now
 }
});

app.post('/api/insert', function(req, res) {
var student = ({
 _id: req.body.sEmail,
 sName: req.body.sName,
 sEmail: req.body.sEmail,
 sPhoneNumber: req.body.sPhoneNumber,
 sAddress: req.body.sAddress,
 sDepartment: req.body.sDepartment
 });
 Student.addStudent(student, function(err, student) {
 if (student) {
 response = {
 "result": "Data inserted succesfully"
 }
 res.json(response);
 } else {
 error = {
 "error": "Sorry insertion failed"
 }
 res.json(error);
 }
 });
});
module.exports.addStudent = function(student, callback) {
  Student.create(student, callback);
}
app.get('/api/retrieve', function(req, res) {
 Student.getDetails(function (err, student) {
 if (student) {
 response = {
 "result": student
 }
 res.json(response);
 } else {
 error = {
 "error": "Sorry retrieve failed"
 }
 res.json(error);
 }
 });
});
module.exports.getDetails = function(callback, limit) {
 Student.find(callback).limit(limit);
}
app.post('/api/update', function(req, res) {
 var id = req.body.sEmail;
 var student = ({
 sName: req.body.sName,
 sPhoneNumber: req.body.sPhoneNumber,
 sAddress: req.body.sAddress,
 sDepartment: req.body.sDepartment
 });
Student.updateStudent(id, student, {}, function(err, student) {
 if (student) {
 response = {
 "result": "Student Details have been updated!"
 }
 res.json(response);
 } else {
 error = {
 "error": "Sorry update failed"
 }
 res.json(error);
 }
 });
});
module.exports.updateStudent = function(id, student, options, callback) {
 var query = {
 _id: id
 };
 var update = {
 sName: student.sName,
 sPhoneNumber: student.sPhoneNumber,
 sAddress: student.sAddress,
 sDepartment: student.sDepartment
 }
 Student.findOneAndUpdate(query, update, options, callback);
}
app.post('/api/delete', function(req, res) {
 var id = req.body.sEmail;
 Student.removeStudent(id, function(err, student) {
 if (student.result.n != 0) {
 response = {
 "result": "Student Record has been deleted!"
 }
 res.json(response);
 } else {
 error = {
 "error": "Please check entered ID"
 }
 res.json(error);
 }
 });
});
module.exports.removeStudent = function(id, callback) {
 var query = {
 _id: id
 };
 Student.remove(query, callback);
}
app.use(express.static(__dirname + '/dist'));

$.post("/api/insert", formData, function(response) {
if (response.error == undefined)
showSuccess(response.result)
else {
showError(response.error)
}
