const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Backend is running on port 3000');
});
