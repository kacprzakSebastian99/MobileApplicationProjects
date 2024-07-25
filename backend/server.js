const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const getEventDataFromDatabaseHandler = require("./my_Modules/getEventFromDB");
const addEventToDB = require("./my_Modules/addEventToDB");
const deleteEventFromDB = require("./my_Modules/delEventFromDB");
const putEventToDB = require("./my_Modules/putEventToDB");
const registerUserDB = require("./my_Modules/registerUserDB");
const loginDB = require("./my_Modules/loginDB");
const updatePasswordDB = require("./my_Modules/updatePasswordDB");
const joinUserToEvent = require("./my_Modules/joinUserToEvent");
const leaveUserFromEvent = require("./my_Modules/leaveUserFromEvent");
const sendScores = require("./my_Modules/putScoreToEvent");
const deleteUserDB = require("./my_Modules/deleteUserDB");
const getScores = require("./my_Modules/getScore");
const getScoreDetails = require("./my_Modules/getScoresDetails");
const updateEventStatusDB = require("./my_Modules/updateEventStatusDB");
const getUsersEvent = require("./my_Modules/getUsersEvent");
const getUserCount = require("./my_Modules/getUserCount");
const sendCode = require("./my_Modules/sendCodeDB");

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const scoreImagesDir = path.join(__dirname, 'ScoreImages');
if (!fs.existsSync(scoreImagesDir)) {
    fs.mkdirSync(scoreImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, scoreImagesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/getEvent", getEventDataFromDatabaseHandler);
app.post("/addNewEvent", addEventToDB);
app.delete("/deleteEvent/:eventId", deleteEventFromDB);
app.put("/updateEvent/:id", putEventToDB);
app.put("/updateEventStatus/:id", updateEventStatusDB);
app.post("/join", joinUserToEvent);
app.delete("/leave/:eventName/:userName", leaveUserFromEvent);
app.put("/sendScores", upload.single('image'), sendScores);
app.get("/getScores/:eventName", getScores);
app.post("/login", loginDB);
app.post("/register", registerUserDB);
app.post("/change", updatePasswordDB);
app.delete("/deleteUser/:userId", deleteUserDB);
app.get("/getusers/:eventName", getUsersEvent);
app.get("/getUserCount/:eventName", getUserCount);
app.get("/getScoreDetails", getScoreDetails);
app.post("/sendCode", sendCode);

app.use('/ScoreImages', express.static(path.join(__dirname, 'ScoreImages')));

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
