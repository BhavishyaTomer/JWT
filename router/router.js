import express from "express";
import ExpressValidator from "express-validator";
import { check, validationResult } from "express-validator";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import user from "../database/Db.js"
const router = express.Router();

router.post("/signup", [[
    check("email","email is not valid").isEmail(),
    check("password","password is not valid").isLength({ min: 5 })
]], async (req, res) => {
    const { email, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(501).json({ errors: errors.array() })
    }
    let userData=user.find((user)=>{
        return user.email===email
    });
    if(userData)
    {
       return res.status(400).json({"error":[{
            "error message":"data is  there"}
        ]})
    }
    let hashedPassword=await bcrypt.hash(password,5)
    console.log("password is",hashedPassword)
    const token = jwt.sign({ email }, "$2b$05$ClxgXHb9k9zqNGrQ2tbPs.PmXrygbDEUp6aGP4LXQbpYFI4x.OmZO",{expiresIn:360000});
    user.push({
        email,
        password:hashedPassword
    })
    return res.json({token})
});


router.get("/", (req, res) => {
    res.send("there hello").status(200)
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("hitting");

    // Find user by email
    let userInfo = user.find((user) => user.email === email);
    if (!userInfo) {
        console.log("User not found:", email);
        return res.status(400).json({
            errors: [{ msg: "Invalid credentials" }]
        });
    }

    try {
        console.log("Retrieved user info:", userInfo);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, userInfo.password);
        console.log("isMatch:", isMatch);
        if (!isMatch) {
            console.log("Invalid password:", password);
            return res.status(400).json({
                errors: [{ msg: "Invalid password" }]
            });
        }

        // If passwords match, create and send token
        const token = jwt.sign({ email }, "$2b$05$ClxgXHb9k9zqNGrQ2tbPs.PmXrygbDEUp6aGP4LXQbpYFI4x.OmZO", { expiresIn: 360000 });
        return res.json({ token });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/all",(req,res)=>{
    res.json(user)
})



export default router;