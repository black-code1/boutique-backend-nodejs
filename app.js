const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');


const dbURI = 'mongodb+srv://legrand:legrand@cluster0.jgecv.mongodb.net/boutique?retryWrites=true&w=majority';

mongoose.connect(dbURI,{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((erreur) => console.log(erreur));
  
  const app = express();



// Problème de CORS
app.use((req, res, next) => {
  // d'accéder à notre API depuis n'importe quelle origine ( '*' ) 
  res.setHeader('Access-Control-Allow-Origin', '*');
  // d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

  //d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// définissez sa fonction json comme middleware global pour votre application,
app.use(bodyParser.json());

app.post('/api/products', (req, res, next) => {
  
  // Suppression _id envoyé par le front-end
  delete req.body._id;
  const product = new Product({
    ...req.body
  });
  product.save()
      .then(() => res.status(201).json({ product }))
      .catch(error => res.status(400).json({ error }));
  
});

app.put('/api/products/:id', (req, res, next) => {
  Product
        .updateOne({_id : req.params.id}, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified !' }))
        .catch(error => res.status(400).json({ error }));
})

app.delete('/api/products/:id', (req, res, next) => {
  Product
      .deleteOne({_id : req.params.id})
      .then(() => res.status(200).json({ message: 'Deleted'}))
      .catch(error => res.status(400).json({ error }));
})
app.get('/api/products/:id', (req, res, next) => {
  Product
        .findOne({ _id: req.params.id })
        .then(product => res.status(200).json({product}))
        .catch(error => res.status(404).json({ error }));
})
//use : nous lui passons un string, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware.
app.get('/api/products', (req, res, next) => {
  Product
      .find()
      .then(products => res.status(200).json({products}))
      .catch(error => res.status(400).json({ error }));
});


module.exports = app;
