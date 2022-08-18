const fs = require("fs");



	//Membuat folder data jika belum ada
const dirPath = "./data";
if(!fs.existsSync(dirPath)){
	fs.mkdirSync(dirPath);
}
	//Membuat file contacts.json jika belum ada
const dataPath = "./data/contacts.json";
if(!fs.existsSync(dataPath)){
	fs.writeFileSync(dataPath, "[]", "utf-8");
}
	//Ambil semua data di contact.json
const loadContact = ()=>{
	const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
	const contacts = JSON.parse(fileBuffer);
	return contacts;
}
	//Cari contact berdasarkan nama
const findContact = (name)=>{
	const contacts = loadContact();
	const contact = contacts.find((contact)=>contact.name.toLowerCase() === name.toLowerCase());
	return contact;

}
	//Menuliskan / Menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts)=>{
	fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
}
	//Menambahkan data kontak baru
const addContact = (contact)=>{
	const contacts = loadContact();
	contacts.push(contact);
	saveContacts(contact);
}
	//Mengecek apakah ada nama yang duplikat
/*
const cekDuplikat = (name)=>{
	const contacts = loadContact();
	return contacts.find((contact)=>contact.name === name);
}
*/





module.exports = {loadContact, findContact, addContact};
