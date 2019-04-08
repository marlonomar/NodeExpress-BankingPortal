/**
 * app.js
 */

 //requires=================
const fs = require('fs');
const path = require('path');
const express = require('express');

const {users,accounts,writeJSON}= require('./data')

const app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.get('/transfer',(req,res)=>res.render('transfer'))

app.post('/transfer',(req,res)=>{
    accounts[req.body.from].balance = accounts[req.body.from].balance - req.body.amount;
    accounts[req.body.to].balance = parseInt(accounts[req.body.to].balance) + parseInt(req.body.amount,10);
    writeJSON()
    res.render('transfer',{message: 'Transfer Completed'});
})

//aqui tomaremos los valores del balance que esta en el json dependiendo la propiedad que escojamos en el
//formulario y primer valor sera igual a el mismo menos el valor que nosotros agregemos al input del formulario
//en el segundo valor sera lo mismo solo que sumara el valor del numero ingresado en el input
//y actualizara los valores del json.

app.get('/payment',(req,res)=> res.render('payment',{account: accounts.credit}));

app.post('/payment',(req,res)=>{
    accounts.credit.balance -= req.body.amount;
    accounts.credit.available += parseInt(req.body.amount,10);
    writeJSON()
    res.render('payment',{ message: "Payment Successful", account: accounts.credit });

});
// aqui hacemos un proceso similar al anterior 

app.get('/',(req,res)=> res.render('index', {title:'Account Summary',accounts}));

app.get('/savings', (req,res)=>{
    res.render('account', { account : accounts.savings});
});

app.get('/checking', (req,res)=>{
    res.render('account', { account : accounts.checking});
});

app.get('/credit', (req,res)=>{
    res.render('account', { account : accounts.credit});
});

app.get('/profile',(req,res)=>{
    res.render('profile',{user: users[0]});
})
//aqui es creado el servidor especificando que se abrira en en localhost:3000
app.listen(3000,()=> console.log('Ps Project Running on Port 3000!'));

