const express = require('express');
const router = express.Router();

// PFC Model
let PFC = require('../models/pfc');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('pfc_views/add_pfc', {
    title: 'Add PFC'
  });
});

// Show Route
router.get('/show', ensureAuthenticated, function (req, res) {
  PFC.find({ companyid: req.user.companyid }, function (err, pfcs) {
    if (err) {
      console.log(err);
    } else {
      res.render('pfc_views/showall_pfc', {
        title: 'List PFC',
        pfcs: pfcs
      });
    }
  });
});

// Add Submit POST Route
router.post('/add', ensureAuthenticated, function (req, res) {
  req.checkBody('operationNum', 'Operation Number is required').notEmpty();
  req.checkBody('machineNum', 'Machine Number is required').notEmpty();
  req.checkBody('prodChars', 'Produt characteristics are required').notEmpty();
  req.checkBody('processChars', 'Process Chars are required').notEmpty();
  req.checkBody('operationDesc', 'Operation description required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pfc_views/add_pfc', {
      title: 'Add PFC',
      errors: errors
    });
  } else {
    let pfc = new PFC();
    pfc.operationNum = req.body.operationNum;
    pfc.machineNum = req.body.machineNum;
    pfc.offAssly = req.body.offAssly;
    pfc.prodChars = req.body.prodChars;
    pfc.processChars = req.body.processChars;
    pfc.char = req.body.char;
    pfc.remarks = req.body.remarks;
    pfc.companyid = req.user.companyid;
    pfc.addedBy = req.user.email;


    pfc.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'PFC Added');
        res.redirect('/pfc/show');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  PFC.findById(req.params.id, function (err, article) {
    if (article.author != req.user.name) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', ensureAuthenticated, function (req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = { _id: req.params.id }

  Article.update(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.get('/delete/:id', function (req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = { _id: req.params.id }
  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user.name) {
      res.status(500).send();
    } else {
      Article.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        req.flash('success', 'Article Deleted');
        res.redirect('/');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    User.find({ name: article.author }, function (err, user) {
      res.render('article', {
        article: article,
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
