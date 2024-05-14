const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { StudentModel } = require("./student");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === "admin" && password === "admin123") {
      res.send({ message: "Admin login successfull" ,data:{username,password}});
    } else {
      res.status(400).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).send({ "message from post request": error.message });
  }
});

app.post("/student/register", async (req, res) => {
  const student = new StudentModel({
    username: req.body.username,
    enrollmentYear:req.body.enrollmentYear,
    password: req.body.password,
  });

  try {
    const existingStudent = await StudentModel.findOne({
      username: req.body.username,
    });
    if (existingStudent) {
      return res.status(400).send({ message: "Username already exist" });
    }
    const newStudent = await student.save();
    res.status(201).send(newStudent);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.post("/student/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("---------------------------------------->",username,password)
  try {
    const student = await StudentModel.findOne({ username, password });
    res.json({ message: "Login successful", id: student._id, username ,student});
    
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/allstudents/list", async (req, res) => {
  try {
    const student = await StudentModel.find();
    res.status(200).send(student);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.delete("/student/:studentId", async (req, res) => {
  const {studentId} = req.params;
  try {
    const student = await StudentModel.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    const student1= StudentModel.find()
    res.status(200).send({ message: "Student deleted successfully", student1 });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.post("/addstream",async(req,res)=>{
  const {username,stream}=req.body;
  try{
const user = await StudentModel.findOne({username});
if(user){
  user.field.push(stream);
  await user.save();
  res.status(200).send(user)
}else{
  res.status(400).send({message:"user not found"})
}
  }
  catch(error){
    res.status(400).send({message:error.message})
  }
})

app.patch("/removestream",async(req,res)=>{
  const {username,stream}=req.body;
  try{
const user = await StudentModel.findOne({username});
if(user){
  user.field.remove(stream);
  await user.save();
  res.status(200).send(user)
}else{
  res.status(400).send({message:"user not found"})
}
  }
  catch(error){
    res.status(400).send({message:error.message})
  }
})



















const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/");
    await connection;
    console.log(
      "connected to mongo <================================================"
    );
  } catch (err) {
    console.log(err);
    console.log("Not able to connect port");
  }
});
