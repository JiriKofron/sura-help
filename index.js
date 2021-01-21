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

app.post('/create', (req, res) => {
  console.log(req.body);
  console.log(Project);
  const project = new Project({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    comment: req.body.comment,
  });
  project.save(() => {
    const title = new Title({
      _id: new mongoose.Types.ObjectId(),
      newTitle: req.body.newTitle,
      project: project._id,
    });
    title.save();

    Project.findOne({ title: req.body.title }, (err, project) => {
      project.titlesList = title;
      project.save();
    });
  });

  res.send('databaze zapsana');
});

app.post('/title', (req, res) => {
  Title.create({ newTitle: req.body.title });
  res.send('title vytvořen');
});

app.get('/populate', (req, res) => {
  Project.findOne({ title: 'johoho5' }).populate('titlesList');
  res.send('populate');
});

//Here I want to delete the project with its refernced (delete = project + its titles list)
app.delete('/delete/:id/', (req, res) => {
  const id = req.params.id;

  Project.deleteMany({ _id: id }, (err, doc) => {
    if (!err) {
      console.log(doc);
      console.log(id);
      res.send('smazano');
    } else {
      console.log('Error in project delete :' + err);
    }
  });
  Title.deleteMany({ project: id }, (err, doc1) => {
    if (!err) {
      console.log(doc1);
    }
  });
});

app.listen(4000, () => console.log('server bezi 4000'));
