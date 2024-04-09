const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const date = new Date().getFullYear();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

const amPM = (string) => {
  return string >= 12 ? 'PM' : 'AM';
};

app.get('/errorPage', (req, res) => {
  res.status(200).render('error', { date });
});

app.get('/', async (req, res) => {
  const query = req.query.searchQ || 'London';
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/current.json',
    params: { q: query },
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  };
  try {
    const response = await axios.request(options);
    const today = new Date(response.data.location.localtime).toLocaleDateString(
      'en-GB',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    );
    const ampm = amPM(
      response.data.location.localtime.split(' ')[1].split(':')[0]
    );
    res.status(200).render('home', {
      title: response.data.location.name,
      date,
      data: response.data,
      today: `${today}${ampm}`,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/errorPage');
  }
});

app.get('/forecast', async (req, res) => {
  const query = req.query.forecast || 'London';
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: { q: query, days: 3 },
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  };
  try {
    const response = await axios.request(options);
    res.status(200).render('forcast', {
      title: response.data.location.name,
      date,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/errorPage');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
