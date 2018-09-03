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
const getHash = (str) => {
    var hash = 0;
    if (str.length == 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}
const getAge = (obj) => {
    let today = new Date()
    let res = []
    let year = today.getFullYear() + 1
    let birthday = new Date(obj.birthdate)
    let age = today.getFullYear() - birthday.getFullYear()
    let m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
        year--;
    }
    res.push(age + 1)
    res.push(year)
    return res;

}
const getTodaysBirthdays = (arr) => {
    let newArr = []
    let today = new Date()
    for (let d = 0; d < arr.length; d++) {
        let isBirthday = new Date(arr[d].birthdate)
        if ((isBirthday.getMonth() === today.getMonth()) && (isBirthday.getDate() === today.getDate())) {

            newArr.push(arr[d])
        }
    }
    return newArr

}
const compare = (a, b) => {
    if ((a.name.charAt(0).toUpperCase() + a.name.slice(1)) < (b.name.charAt(0).toUpperCase() + b.name.slice(1)))
        return -1;
    if ((a.name.charAt(0).toUpperCase() + a.name.slice(1)) > (b.name.charAt(0).toUpperCase() + b.name.slice(1)))
        return 1;
    return 0;
}
app.post("/update", function (req, res) {
    let arr = []
    let number = []
    firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
        for (var key in snapshot.val()) {
            let months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
            let toPush = snapshot.val()[key]
            let birthdate = new Date(toPush.birthdate)
            toPush.age = getAge(toPush)[0]
            toPush.year = getAge(toPush)[1]
            toPush.birthyear = birthdate.getFullYear()
            toPush.birthdate = months[birthdate.getMonth()] + ' ' + birthdate.getDate()
            arr.push(toPush)
        }
        pusher.trigger("events-channel", "new-like", {
            birthdays: arr.sort(compare),
            today: getTodaysBirthdays(arr).sort(compare)
        });
        res.send({
            'response': 'ok',
            'data': arr.sort(compare)
        })
    });
});
app.post("/birthday", function (req, res) {
    let arr = []
    let arr2 = []
    let births = []
    let number = []
    let today = new Date()
    firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
        for (var key in snapshot.val()) {
            let months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
            
            let toPush = snapshot.val()[key]
            let birthdate = new Date(toPush.birthdate)
            toPush.age = getAge(toPush)[0]
            toPush.year = getAge(toPush)[1]
            toPush.birthyear = birthdate.getFullYear()
            arr.push(toPush)
            toPush.birthdate = months[birthdate.getMonth()] + ' ' + birthdate.getDate()
            arr2.push(toPush)
        }
        /*for(let d = 0; d < arr.length; d++) {
            let isBirthday = new Date(arr[d].birthdate)
            if((isBirthday.getMonth() === today.getMonth()) && (isBirthday.getDate() === today.getDate())) {
               
                births.push(arr[d])
            }
        }*/
        pusher.trigger("events-channel", "new-like", {
            birthdays: arr2.sort(compare),
            today: getTodaysBirthdays(arr).sort(compare)
        });
        res.send({
            'response': 'ok',
            'data': getTodaysBirthdays(arr).sort(compare)
        })
    });
});
app.get("/getPersonById/:id", function(req, res) {
    firebase.database().ref('birthdays/' + req.params.id).once('value').then(function (snapshot) {
        let data = snapshot.val()
        if(data) {
            res.send({
                'response': 'ok',
                'data': data
            })
        } else {
            res.send({
                'response': 'notFound',
                'data': {}
            })
        }
    })
})
app.post("/add", function (req, res) {
    // -------------------------------
    // Trigger pusher event
    // ------------------------------
    let arr = []
    firebase.database().ref('lifetime_people').off()
    firebase.database().ref('lifetime_people').once('value').then(function (snapshot) {
        let id = parseInt(snapshot.val()) + 1;
        try {
            firebase.database().ref('birthdays/' + getHash((req.body.name + req.body.birthdate + req.body.address).replace(/\s/g, ""))).set({
                name: req.body.name,
                birthdate: req.body.birthdate,
                address: req.body.address,
                image: req.body.image,
                id: getHash((req.body.name + req.body.birthdate + req.body.address).replace(/\s/g, ""))
            })
            firebase.database().ref('lifetime_people').set(id)
            console.log("Added " + req.body.name + " successfully!")

        } catch (e) {
            console.log(e)
        }
        firebase.database().ref('/birthdays').once('value').then(function (snapshot) {
            for (var key in snapshot.val()) {
                let months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ]
                let toPush = snapshot.val()[key]
                toPush.age = getAge(toPush)[0]
                toPush.year = getAge(toPush)[1]
                toPush.birthyear = birthdate.getFullYear()
                let birthdate = new Date(toPush.birthdate)
                toPush.birthdate = months[birthdate.getMonth()] + ' ' + birthdate.getDate()
                arr.push(toPush)
            }
            pusher.trigger("events-channel", "new-like", {
                birthdays: arr.sort(compare),
                today: getTodaysBirthdays(arr).sort(compare)
            });
        });
    })

});
app.listen("3120");
console.log("Listening on localhost:3120");
