const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const url = 'mongodb://127.0.0.1:27017/help';
const Project = require('./Project');
const Title = require('./Title');

const db = mongoose.connection;
db.once('open', (_) => {
  console.log('database connected:', url);
});

db.on('err', (err) => {
  console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('main route');
});

app.get('/create', (req, res) => {
  res.send('cesta je');
});
// create basic sceleton of new project
app.post('/create', (req, res) => {
  const project = new Project({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    comment: req.body.comment,
  });
  // save the project and during the save, create new Title binded to project by "project._id", thanks to binding it is possible to delete Title objects which belong to the delete Project
  project.save(() => {
    const title = new Title({
      _id: new mongoose.Types.ObjectId(),
      newTitle: req.body.newTitle,
      project: project._id,
    });
    title.save();

    // Finding the created project, so the Title can be added to titleList array
    Project.findOne({ title: req.body.title }, (err, project) => {
      project.titlesList = title;
      project.save();
    });
  });

  res.send('Object created in database');
});

//Here I want to delete the project with its refernced (delete = project + its titles list)
app.delete('/delete/:id/', (req, res) => {
  const id = req.params.id;

  Project.deleteMany({ _id: id }, (err, doc) => {
    if (!err) {
      console.log(doc);
      console.log(id);
      res.send('deleted');
    } else {
      console.log('Error in project delete :' + err);
    }
  });

  // Looking for Project id in the Title object in project value, if more Titles apply, the deleteMany method allows to delete them all
  Title.deleteMany({ project: id }, (err, doc1) => {
    if (!err) {
      console.log(doc1);
    } else {
      console.log('Error in title delete: ' + err);
    }
  });
});

app.listen(4000, () => console.log('server bezi 4000'));
