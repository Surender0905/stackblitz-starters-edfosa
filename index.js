const express = require('express');
let cors = require('cors');
const { stocks } = require('./data');
const app = express();
const port = 3010;

app.use(cors());

app.get('/stocks/sort/pricing', (req, res) => {
  const pricing = req.query.pricing;

  if (pricing !== 'low-to-high' && pricing !== 'high-to-low') {
    return res.status(400).json({
      error: 'Invalid pricing parameter. Use "low-to-high" or "high-to-low".',
    });
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    return pricing === 'low-to-high' ? a.price - b.price : b.price - a.price;
  });

  res.json(sortedStocks);
});

app.get('/stocks/sort/growth', (req, res) => {
  const { growth } = req.query;

  if (growth !== 'high-to-low' && growth !== 'low-to-high') {
    return res.status(400).json({
      error: 'Invalid sorting condition. Use "high-to-low" or "low-to-high".',
    });
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    return growth === 'high-to-low'
      ? b.growthRate - a.growthRate
      : a.growthRate - b.growthRate;
  });

  res.json(sortedStocks);
});

const filterByExchange = (exchange) => {
  return stocks.filter(
    (stock) => stock.exchange.toLowerCase() === exchange.toLowerCase()
  );
};

app.get('/stocks/filter/exchange', (req, res) => {
  const { exchange } = req.query;

  if (exchange !== 'NSE' && exchange !== 'BSE') {
    return res
      .status(400)
      .json({ error: 'Invalid exchange. Use "NSE" or "BSE".' });
  }

  const filteredStocks = filterByExchange(exchange);

  res.json(filteredStocks);
});

const filterByIndustry = (industry) => {
  return stocks.filter(
    (stock) => stock.industry.toLowerCase() === industry.toLowerCase()
  );
};

app.get('/stocks/filter/industry', (req, res) => {
  const { industry } = req.query;

  const validIndustries = ['Finance', 'Pharma', 'Power'];
  if (!validIndustries.includes(industry)) {
    return res.status(400).json({
      error: 'Invalid industry. Use "Finance", "Pharma", or "Power".',
    });
  }

  const filteredStocks = filterByIndustry(industry);

  res.json(filteredStocks);
});

app.get('/stocks', (req, res) => {
  res.json(stocks);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
