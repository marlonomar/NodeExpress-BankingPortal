/**
 * app.js
 */

 //requires=================
const fs = require('fs');
const path = require('path');
const express = require('express');

//
const app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
//importamos una "base de datos" contenida en archivos json=======

const accountData = fs.readFileSync(path.join(__dirname,'json','accounts.json'),'utf8');//archivo
const accounts = JSON.parse(accountData);//archivo json valido

const userData = fs.readFileSync(path.join(__dirname,'json','users.json'),'utf8');//este tipo de funciones sirven como enlaces
const users = JSON.parse(userData);


// express : express crea la ruta de la url y llama un archivo , a su vez crea un servidor:
// donde /ruta , respuesta y error , respuesta(archivo);

app.get('/transfer',(req,res)=>res.render('transfer'))

app.post('/transfer',(req,res)=>{
    accounts[req.body.from].balance = accounts[req.body.from].balance - req.body.amount;
    accounts[req.body.to].balance = parseInt(accounts[req.body.to].balance) + parseInt(req.body.amount,10);
    const accountsJSON = JSON.stringify(accounts,null,4);
    fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');
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
    const accountsJSON = JSON.stringify(accounts,null,4);
    fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');
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

