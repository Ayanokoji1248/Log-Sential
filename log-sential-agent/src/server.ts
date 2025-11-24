import express from "express"
import { logsential } from "."

const app = express();
app.use(logsential());

app.get('/', (req, res) => {
    res.send("hello from Log Sential")
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})