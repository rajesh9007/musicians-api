const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const { MONGODB_URI } = process.env;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

connectToDB();

const musicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    instrument: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    yearsExperience: {
      type: Number,
      required: true,
      default: 0,
    },
    bands: {
      type: String,
      required: true,
    },
    albumsRecorded: {
      type: String,
      required: true,
    },
    concertsPerformed: {
      type: String,
      required: true,
    },
  },
  {
    collection: "musicians",
  }
);

const Musician = mongoose.model("Musician", musicianSchema);

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app
  .route("/musicians")
  .get(async (req, res) => {
    const musicians = await Musician.find().catch(() =>
      res.status(500).json({ error: "Failed to fetch musicians" })
    );
    res.json(musicians);
  })
  .post(async (req, res) => {
    const musician = new Musician(req.body);
    await musician
      .save()
      .catch(() =>
        res.status(500).json({ error: "Failed to create musician" })
      );
    res.status(201).json(musician);
  });

app
  .route("/musicians/:id")
  .get(async (req, res) => {
    const musician = await Musician.findById(req.params.id).catch(() =>
      res.status(500).json({ error: "Failed to fetch musician" })
    );
    musician
      ? res.json(musician)
      : res.status(404).json({ error: "Musician not found" });
  })
  .put(async (req, res) => {
    const musician = await Musician.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).catch(() =>
      res.status(500).json({ error: "Failed to update musician" })
    );
    musician
      ? res.json(musician)
      : res.status(404).json({ error: "Musician not found" });
  })
  .delete(async (req, res) => {
    const musician = await Musician.findByIdAndDelete(req.params.id).catch(() =>
      res.status(500).json({ error: "Failed to delete musician" })
    );
    musician
      ? res.json({ message: "Musician deleted successfully" })
      : res.status(404).json({ error: "Musician not found" });
  });

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
