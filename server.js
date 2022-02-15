'use strict'

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

const mongoose = require('mongoose');
const http = require("http");
const express = require("express");
const socket = require("./helper/socket");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

/* routes */
const user = require('./routes/employee');
const skill = require('./routes/skill');
const leaveManagement = require('./routes/leaveManagement');
const dashboard = require('./routes/dashboard');
const notification = require('./routes/notification');
const project = require('./routes/project');
const message = require('./routes/message');
const attendance = require('./routes/timesheet');
const leave = require('./routes/leave');
const technology = require('./routes/technology');
/* routes */

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

app.use(cors());

app.use('/public', express.static(__dirname + '/public'));

socket.init(server);

mongoose.connect(process.env.CONNECTION_STRING + process.env.DB_NAME,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, client) => {
    if (err) console.log("DB connection error", err)
    else { console.log("DB connected") }
  })

/* routes with static path */
app.use('/employee', user);
app.use('/skill', skill);
app.use('/leave-management-api', skill);
app.use('/dashboard', dashboard);
app.use('/api/v1/notification', notification);
app.use('/api/v1/Project', project);
app.use('/timesheet', attendance);
app.use('/leave', leave);
app.use('/leaveManagement',leaveManagement);
app.use('/api/v1/message',message);
app.use('/technology', technology)
/* routes with static path */

/* Express Custom Function */
require("./common/express_custom_function")(express);

server.listen(process.env.PORT || 8300, (err) => {
  if (err) throw err;
  console.log("Server Up And Working");
});


