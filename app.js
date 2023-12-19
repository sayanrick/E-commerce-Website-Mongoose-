const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('658142044af7330b68ba5574');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err); // Pass the error to the error handling middleware
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://sayanrick100:SAYANdas1%40@cluster0.r7walmw.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(async () => {
    const user = await User.findOne();
    if (!user) {
      const newUser = new User({
        name: 'Sayan',
        email: 'sayan@test.com',
        cart: {
          items: []
        }
      });
      await newUser.save();
    }

    app.listen(3000);
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
