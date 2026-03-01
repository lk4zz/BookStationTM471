    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const prisma = require('../db');

    // signup route/process
    router.post(`/signup`, async (req, res) => {
    try {
        const {name, email, password} = req.body; //req data from the bodyform the user submitted
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        });

    //checking if email is already in use using the variable created above by findUnique
    if (existingUser) {
        return res.status(400).json({error: `Email is already in use`}) //400 is bad request(usersfault)
    }

    //encrypting/hasshing the pass using the library bcrypt to store it in the db
    const hashedPassword = await bcrypt.hash(password, 10);   //the 10 is how many times the pass is hashed

    const newUser = await prisma.user.create({  
        data:{
            name,
            email,
            password: hashedPassword,
            roleId: 1,
        }
    });

    res.status(201).json({ //201 is created(success)
        message: "Account created successfully!" ,
        userId: newUser.id
    });

    } catch (error) {
        console.error(error);
        // 500 server error (server fault)
        res.status(500).json({ error: "Something went wrong creating the account." });
    }
    });



    //Login route/process



    router.post(`/login`, async (req, res) => {
    try {
        const {email, password} = req.body; 
        const user = await prisma.user.findUnique({
            where: {email: email}
        });

    if (!user) {
        return res.status(400).json({error: `Email isnt registered`}) 
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
        return res.status(400).json({error: `Incorrect password`})
    }

    res.status(200).json({ //201 is created(success)
        message: "Login successful!" ,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId
      }
    });

    } catch (error) {
        console.error(error);
        // 500 server error (server fault)
        res.status(500).json({ error: "Something went wrong during login." });
    }
    });

    module.exports = router;