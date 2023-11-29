const express = require("express");
const path = require("path");
const multer = require('multer');
const { exec } = require('child_process');
const {helperFnAdd, helperFnUpdate} = require("./helper")

const app = express();
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "views")));

const storageVerify = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, 'imageVerify' + fileExtension);
  }
});

const uploadVerify = multer({ storage: storageVerify });


const storageAdd = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, 'imageAdd' + fileExtension);
  }
});

const uploadAdd = multer({ storage: storageAdd });


const storageUpdate = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

const uploadUpdate = multer({ storage: storageUpdate });

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/error", (req, res) => {
    // res.send('Error occurred!');
    res.render("error.html");
});

app.post('/verify', uploadVerify.single('fileInput'), (req, res) => {
    const command = 'c2patool -d uploads/imageVerify.jpg';

    exec(command, (error, stdout, stderr) => {
    if (!error && !stderr) {
        res.send(`${stdout}`);
    } 
    
    res.redirect('/error')

    });


});

app.post('/add', uploadAdd.single('fileInput'), (req, res) => {
    // res.send("file upload")

    const command = 'c2patool uploads/imageAdd.jpg -m test/test.json -f -o signed_image.jpg';
    const {name, label} = req.body
    helperFnAdd(name, label)
    exec(command, (error, stdout, stderr) => {
    if (!error && !stderr) { 
        res.send(`${stdout}`); 
    } 
    console.log(error.message)
    res.redirect('/error')

    })

});

app.post('/update', uploadUpdate.fields([{ name: 'originalAsset', maxCount: 1 }, { name: 'updatedAsset', maxCount: 1 }]), (req, res) => {
    const image1 = req.files['originalAsset'][0];
    const image2 = req.files['updatedAsset'][0];


    const command = `c2patool uploads/${image2.filename} -p uploads/${image1.filename} -m test/test.json -f -o signed_image.jpg`; 
    const {name, label, actions} = req.body

    helperFnUpdate(name, label, actions)
    exec(command, (error, stdout, stderr) => {
    if (!error && !stderr) {
        res.send(`${stdout}`);
    } 
   
    res.redirect('/error')
 
    });

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});