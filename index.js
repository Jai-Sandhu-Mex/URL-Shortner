const express = require("express");
const URLroute = require("./routes/url");
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url"); 

const app = express();
const PORT = 8001;

app.use(express.json());
app.use("/url", URLroute);

app.get("/:shortId", async (req, res) => {  
    const shortId = req.params.shortId;
    
    const entry = await URL.findOneAndUpdate(
        { ShortId: shortId }, 
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true }
    );

    if (!entry) return res.status(404).json({ error: "Short URL not found" });

    res.redirect(entry.redirectURL);
});

connectToMongoDb("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection failed ❌", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
