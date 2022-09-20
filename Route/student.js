
const express = require("express")
const router = express.Router();
const storagePath = './student.json'
const fs = require('fs');

//save student to json file
const saveStudent = (data) => {
  const stringData = JSON.stringify(data)
  fs.writeFileSync(storagePath, stringData)
}

// retrieve all the data from the jsonfile
const getAllStudents = () => {
  const jsonData = fs.readFileSync(storagePath)
  return JSON.parse(jsonData)
}

//Add a student
router.post('/student/add', (req, res) => {

  var existStudents = getAllStudents()
  const newstudentId = Math.floor(200000 + Math.random() * 900000)//random numbers
  req.body.id = newstudentId.toString()// add the id on the req.body object
  existStudents.students.push(req.body) //push the student info to the students array
  console.log(existStudents);
  saveStudent(existStudents);
  res.send({ success: true, msg: 'student added successfully' })
})

// Read - get all students from the json file
router.get('/student/', (req, res) => {
  const students = getAllStudents()
  res.send(students)
})

// Update - update student by id
router.put('/student/:id', (req, res) => {
  var existStudents = getAllStudents()
  fs.readFile(storagePath, 'utf8', (err, data) => {
    const studentId = req.params['id'];
    var foundStudent = existStudents.students.findIndex(student => student.id == req.params.id);//find the index of the passed id
    req.body.id = req.params.id// add the id on the req.body object
    existStudents.students[foundStudent] = req.body;//update the student that correspond to the found index
    saveStudent(existStudents);
    res.send(`Student with id ${studentId} has been updated`)
  }, true);
});

// delete - delete student by id
router.delete('/student/delete/:id', (req, res) => {
  fs.readFile(storagePath, 'utf8', (err, data) => {
    var existStudents = getAllStudents()//get all students
    filteredStudents = existStudents.students.filter(student => student.id != req.params.id) //filter and just return all the students that have the id not equal to the passed id
    saveStudent({students:filteredStudents});
    res.send(`Student with id ${req.params.id} has been deleted`)
  }, true);
})
module.exports = router;