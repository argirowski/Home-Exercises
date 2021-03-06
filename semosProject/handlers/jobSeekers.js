var jobSeekers = require("../models/jobSeekers");
var bcrypt = require("bcrypt") //if only bcrypt is installed, delete the -js at the end
var validator = require("fastest-validator");
var validatorSchema = require("../validators/users");
var utils = require("../utils");

// Get all users / job seekers

var getAllJobSeekers = (req, res) => {
    jobSeekers.getAllJobSeekers((err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error" + err);
        } else {
            res.send(data);
        }
    });
};

// Get user / job seeker by first name

var getJobSeekerByFirstName = (req, res) => {
    var name = req.params.name;
    jobSeekers.getJobSeekerByFirstName(name, (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error" + err);
        } else {
            res.send(data);
        }
    })
}

// Get user / job seeker by ID

var getJobSeekerById = (req, res) => {
    var id = req.params.id;
    jobSeekers.getJobSeekerById(id, (err, data) => {
        if (err) {
            res.status(404).send("Not Found !!!!");
        }
    });
};

// Post (create) user / job seeker

var createJobSeeker = (req, res) => {
    let v = new validator();
    var valid = v.validate(req.body, validatorSchema.seekerCreate);

    if (valid === true) {
        jobSeekers.getJobSeekerByEmail(req.body.email, (err, data) => {
            if (err) {
                return res.send(err);
            } else {
                if (data === null) {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        var seekerData = req.body;
                        seekerData.password = hash;
                        seekerData.role = "user";
                        jobSeekers.createJobSeeker(seekerData, (err) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(201).send("OK");
                            }
                        });
                    });
                } else {
                    res.status(400).send("User exists");
                }
            }
        })
    } else {
        res.status(400).send(valid);
    }
}
// var valid = req.body.firstname != undefined && req.body.firstname != ""
// req.body.lastname != undefined && req.body.lastname != ""
// req.body.email != undefined && req.body.email != ""
// req.body.password != undefined && req.body.password != "";
// if (valid) {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         var seekerData = req.body;
//         seekerData.password = hash;
//         seekerData.role = "user";
//         jobSeekers.createJobSeeker(seekerData, (err) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.status(201).send("OK !!!");
//             }
//         });
//     });
// } else {
//     res.status(400).send("User Already Exists");
// }



// Delete user / job seeker by ID

var deleteJobSeekerById = (req, res) => {
    var id = req.params.id;
    jobSeekers.deleJobSeekerById(id, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(204).send("OK !!!");
        }
    })
}

// Update user / job seeker by ID

updateJobSeekerById = (req, res) => {
    var id = req.params.id;
    var seekerData = req.body;
    jobSeekers.updateJobSeekerById(id, seekerData, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send("OK !!!");
        }
    });
}

module.exports = {
    getAllJobSeekers,
    getJobSeekerByFirstName,
    getJobSeekerById,
    createJobSeeker,
    deleteJobSeekerById,
    updateJobSeekerById
}