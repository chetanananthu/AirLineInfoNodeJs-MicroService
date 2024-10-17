const express=require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 2000;

app.use('/flights',createProxyMiddleware({target:'http://localhost:2002/flights'}));
app.use('/passanger', createProxyMiddleware({target:'http://localhost:2003/passanger'}));
app.use('/airline', createProxyMiddleware({target:'http://localhost:2001/airline'}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

