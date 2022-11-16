const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { SECRET } = require("../config");
const Message = require("../models/Message");




/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const saveMessage = async (req, res) => {
    const {message} = req.body;
    const newMessage = new Message({
        username:req.user.username,
        role:req.user.role,
        email:req.user.email,
        message:message,
    })
    const response = await newMessage.save();
    res.status(200).json(response)
};
const saveMessageAndFile = async (req, res) => {
    const {message} = req.body;
    const newMessage = new Message({
        username:req.user.username,
        role:req.user.role,
        email:req.user.email,
        message:message,
        file:req.file.path
    })
    const response = await newMessage.save();
    res.status(200).json(response)
};


module.exports = {
    saveMessage,
    saveMessageAndFile
};
