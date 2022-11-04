const express = require('express');
const layouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
let connection = {
    user: 'root',
    password: '123456',
    host: 3306,
    database: 'demomodule4',
    charset: 'utf8_general_ci'
}
let connect = mysql.createConnection(connection);
connect.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log("connect success");
    }
})
app.use(layouts);
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('layout', 'index');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));
app.listen(3000, () => {
    console.log('Server is running')
});

app.get('/', (req, res) => {
    const sql = `select *
                 from product`;
    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.render('product/show', {
            products: data
        });
    })

});
app.get('/create', (req, res) => {
    res.render('product/create');
});
app.post('/create', (req, res) => {
    const file = req.files;
    if (file) {
        let image = file.image
        image.mv('./public/storage/' + image.name);
        const sql = `insert into product(name, image, description)
                     values ("${req.body.name}", "/storage/${image.name}", "${req.body.description}")`
        connect.query(sql, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect(301, '/');
            }
        })
    }
});
app.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
})