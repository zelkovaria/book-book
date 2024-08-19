// npm i express cors axios dotenv

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

console.log(process.env.TTB_KEY);

app.use(cors());

app.get("/api/search", async (req, res) => {
  try {
    const { query, queryType, maxResults, start, searchTarget } = req.query;

    if (!query) {
      return res.json({ item: [] });
    }

    const apiUrl = "https://www.aladin.co.kr/ttb/api/ItemSearch.aspx";

    const response = await axios.get(apiUrl, {
      params: {
        ttbkey: process.env.TTB_KEY,
        Query: query,
        QueryType: queryType || "Title",
        MaxResults: maxResults || 10,
        start: start || 1,
        SearchTarget: searchTarget || "Book",
        output: "js",
        Version: "20131101",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from Aladin API" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
