require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");
const firebase = require("firebase");
const app = express();

const config = {
    apiKey: "AIzaSyC47qEazZdyTqzYCc99Mhpqwuwp3mdaSqM",
    authDomain: "inventario-a09a6.firebaseapp.com",
    databaseURL: "https://inventario-a09a6.firebaseio.com",
    projectId: "inventario-a09a6",
    storageBucket: "inventario-a09a6.appspot.com",
    messagingSenderId: "782810131722"
};
firebase.initializeApp(config);
const database = firebase.database();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});

app.post("/update", function (req, res) {
    let arr = []
    let number = []
    firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
        for(var key in snapshot.val()){
            arr.push(snapshot.val()[key])
        }
        pusher.trigger("events-channel", "new-like", {
            birthdays: arr
        });
        res.send({
            'response': 'ok',
            'data': arr
        })
    });
});
app.post("/birthday", function (req, res) {
    let arr = []
    let births = []
    let number = []
    let today = new Date()
    firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
        for(var key in snapshot.val()){
            arr.push(snapshot.val()[key])
        }
        for(let d = 0; d < arr.length; d++) {
            let isBirthday = new Date(arr[d].birthdate)
            if((isBirthday.getMonth() === today.getMonth()) && (isBirthday.getDate() === today.getDate())) {
               
                births.push(arr[d])
            }
        }
        pusher.trigger("events-channel", "new-like", {
            birthdays: arr
        });
        res.send({
            'response': 'ok',
            'data': births
        })
    });
});
app.post("/add", function (req, res) {
    // -------------------------------
    // Trigger pusher event
    // ------------------------------
    let arr = []
    firebase.database().ref('lifetime_people').once('value').then(function (snapshot) {
        let id = parseInt(snapshot.val()) + 1;
        console.log("de lo mio")
        firebase.database().ref('birthdays/' + id).set({
            name: req.body.name,
            birthdate: req.body.birthdate,
            address: req.body.address
        })
        firebase.database().ref('lifetime_people').set(id)
        firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
            for(var key in snapshot.val()){
                arr.push(snapshot.val()[key])
            }
            pusher.trigger("events-channel", "new-like", {
                birthdays: arr
            });
        });
    })

});
app.listen("3120");
console.log("Listening on localhost:3120");