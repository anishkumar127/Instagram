const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
var sendinBlue = require("nodemailer-sendinblue-transport");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  Email_USERNAME,
  Email_PASSWORD,
  EMAIL,
} = require("../config/keys");

//nodemailer
const smtpTransport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: "587",
  auth: {
    user: Email_USERNAME,
    pass: Email_PASSWORD,
    // api_key:
  },
});

// home route
// router.get("/", (req, res) => {
//   res.send("hello");
// });

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});
router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the field" });
  }

  try {
    //   res.json({ message: "successfully posted" });
    const data = await User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      //hasing password before save

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          pic: pic,
        });
        user
          .save()

          .then((user) => {
            // smtpTransport.sendMail({
            //   to: user.email,
            //   from: "no-reply@insta.com",
            //   subject: "signup success",
            //   html: "<h1>welcome to instagram</h1>",
            // });
            // console.log(smtpTransport);

            async function run() {
              let sendResult = await smtpTransport.sendMail({
                from: "anishbishnoi127@gmail.com",
                to: user.email,
                subject: " mail signup",
                html: "<h1>welcome to ssignup</h1>",
              });
              console.log(sendResult);
            }
            run().catch((err) => {
              console.log(err);
            });
            //use can then  but make application slow both are independed
            res.json({ message: "SignUp successful." });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  } catch (err) {
    res.json({ err });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please add email or password" });
  }
  try {
    await User.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "email provided Invalid" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            //   res.json({ message: "successfully SingIn" });
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({
              token: token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({ error: "email provided Invalid" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
});

//reset password
router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "user dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 36000000;
      user.save().then((result) => {
        smtpTransport.sendMail({
          to: user.email,
          from: "anishbishnoi127@gmail.com",
          subject: "password reset",
          html: `<p>You requested for password reset</p>
            <h5> Click on this <h1><a href="${EMAIL}/reset/${token}">link</a> </h1> to reset password</h5>
            `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
});

// confirm reset password

router.post("/new-password", (req, res) => {
  const NewPassword = req.body.password;
  const sendToken = req.body.token;
  User.findOne({ resetToken: sendToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ err: "try again session expired" });
      }
      bcrypt.hash(NewPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
