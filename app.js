const express = require('express');
require('dotenv').config();
const authRouter  = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const charityRouter = require('./routers/charityRouter');
const adminRouter = require('./routers/adminRouter');
const paymentRouter = require('./routers/paymentRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./models');
const db = require('./utils/db-connect');
const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',charityRouter);
app.use('/',adminRouter);
app.use('/',paymentRouter);

db.sync({force:false}).then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
});



