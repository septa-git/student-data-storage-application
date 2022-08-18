const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {body, validationResult} = require("express-validator");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const {
	loadContact,
	findContact,
	addContact,
	cekDuplikat,
	deleteContact,
	updateContacts
      } = require("./utils/contacts");



const app = express();



app.set("view engine", "ejs");
app.use(expressLayouts); //Third party middleware
app.use(express.static("public")); //Built-in middleware
app.use(express.urlencoded({
	extended: true
}));
	//Konfigurasi flash
app.use(cookieParser("secret"));
app.use(session({
	cookie: {maxAge: 6000},
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.use(flash());





app.get("/", (req,res)=>{
	let mahasiswa = [
		{
			name: 'Mas Cecep',
			email: 'cecep@gmail.com'
		},
		{
			name: 'Mas Ucup',
			email: 'ucup@gmail.com'
		},
		{
			name: 'Mas Mamat',
			email: 'mamat@gmail.com'
		}
	];
	res.render("home", {
		layout: "layouts/main-layout",
		title: 'Home Page',
		mahasiswa
	});
});
app.get("/about", (req,res)=>{
	res.render("about", {
		layout: "layouts/main-layout",
		title: 'About Page'
	});
});
app.get("/contact", (req,res)=>{
	const contacts = loadContact();
	res.render("contact", {
		layout: "layouts/main-layout",
		title: 'Contact Page',
		contacts,
		msg: req.flash("msg")
	})
});
app.get("/contact/add", (req,res)=>{
        res.render("add-contact", {
                layout: "layouts/main-layout",
                title: 'Page Add Contact'
	});
});
app.post("/contact", [
	body("name").custom((value)=>{
		const duplikat = cekDuplikat(value);
		if(duplikat){
			throw new Error('Nama kontak sudah digunakan!');
		}
		return true;
	}),
	body("email", 'Email yang dimasukan tidak valid!').isEmail(),
	body("phone", 'Nomor yang dimasukan tidak valid!').isMobilePhone("id-ID")
],(req,res)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		res.render("add-contact", {
			layout: "layouts/main-layout",
			title: 'Page Add Contact',
			errors: errors.array()
		});
	}else{
		addContact(req.body);
			//Kirimkan flash message
		req.flash("msg", 'Data kontak berhasil ditambahkan!');
		res.redirect("/contact");
	}
});
app.post("/contact/update", [
        body("name").custom((value, {req})=>{
                const duplikat = cekDuplikat(value);
                if(req.body !== req.body.oldName && duplikat){
                        throw new Error('Nama kontak sudah digunakan!');
                }
                return true;
        }),
        body("email", 'Email yang dimasukan tidak valid!').isEmail(),
        body("phone", 'Nomor yang dimasukan tidak valid!').isMobilePhone("id-ID")
],(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
                res.render("edit-contact", {
                        layout: "layouts/main-layout",
                        title: 'Page Edit Contact',
			contact: req.body,
                        errors: errors.array()
                });
        }else{
                updateContacts(req.body);
                        //Kirimkan flash message
                req.flash("msg", 'Data kontak berhasil diubah!');
                res.redirect("/contact");
        }
});
app.get("/contact/:name", (req,res)=>{
	const contact = findContact(req.params.name);
	res.render("detailt", {
		layout: "layouts/main-layout",
		title: 'Contact Details Page',
		contact
	});
});
app.get("/contact/delete/:name", (req,res)=>{
	const contact = findContact(req.params.name);
	if(!contact){
		res.status(400);
		res.send("<h1>404</h1>");
	}else{
		deleteContact(req.params.name);
		req.flash("msg", 'Data contact berhasil dihapus!');
		res.redirect("/contact");
	}
});
app.get("/contact/edit/:name", (req,res)=>{
	const contact = findContact(req.params.name);
	res.render("edit-contact", {
		layout: "layouts/main-layout",
		title: 'Page Edit Contact',
		contact
	});
});
app.use((req,res)=>{
	res.status(404);
	res.send("<h1>404</h1>");
});





const PORT = 8000;
app.listen(PORT, ()=>{
	console.log(`Example app listening at http://localhost:${PORT}`);
});
