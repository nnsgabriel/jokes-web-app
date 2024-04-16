import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://official-joke-api.appspot.com";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/random-joke", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/random_joke");
        res.render("index.ejs", {
            setups: [result.data.setup],
            punchlines: [result.data.punchline],
        })
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/10-random-jokes", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/random_ten");
        res.render("index.ejs", {
            setups: result.data.map(joke => joke.setup),
            punchlines: result.data.map(joke => joke.punchline),
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/random-joke-by-type", async (req, res) => {
    try {
        const selectedType = req.body.type;
        const result = await axios.get(API_URL + `/jokes/${selectedType}/random`);
        const array = result.data;
        const firstElement = array[0];
        res.render("index.ejs", {
            setups: [firstElement.setup],
            punchlines: [firstElement.punchline],
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/10-jokes-by-type", async (req, res) => {
    try {
        const selectedType = req.body.type;
        const result = await axios.get(API_URL + `/jokes/${selectedType}/ten`);
        res.render("index.ejs", {
           setups: result.data.map(joke => joke.setup),
           punchlines: result.data.map(joke => joke.punchline), 
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/joke-by-id", async (req, res) => {
    try {
        const typedId = req.body.id;
        const result = await axios.get(API_URL + `/jokes/${typedId}`);
        res.render("index.ejs", {
           setups: [result.data.setup],
           punchlines: [result.data.punchline], 
        });
    } catch (error) {
        res.status(404).send(error.message);
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});