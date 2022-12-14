const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const https = require('https');
const fs = require('fs');
const path = require('path');

const { Server } = require("socket.io");


// Bring in the app constants
const { DB, PORT } = require("./config");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

//Test Route
app.get("/test", (req, res) => res.send("Hello World"));

// User Router Middleware
app.use("/api/users", require("./routes/users"));

const startApp = async () => {
  try {
    // Connection With DB
    await connect('mongodb+srv://kaveen:kaveen123@cluster0.xm3npep.mongodb.net/?retryWrites=true&w=majority', {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${DB}`, 
      badge: true
    });

    const sslServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app); 

    const server = sslServer.listen(PORT, () => {
      console.log(`Secure app listening on port ${PORT}`)
    })

    const io = new Server(server, {
      cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    
    io.on("connection", (socket) => {
      console.log(`User Connected: ${socket.id}`);
    
      socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
    
      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });
    
      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
    });
    
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp();
