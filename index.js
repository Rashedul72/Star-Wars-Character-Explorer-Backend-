const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/characters", async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const apiRes = await axios.get(`https://www.swapi.tech/api/people/?name=${search}`);
    const results = apiRes.data.result;

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Character not found" });
    }

    const characterData = results[0]; // has both .properties and .description

    res.json({
      result: [
        {
          properties: characterData.properties,
          description: characterData.description || "No description available"
        }
      ]
    });
  } catch (err) {
    console.error("Backend error:", err.message);
    res.status(500).json({ message: "Error fetching character" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
