import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const BASE_URL = process.env.OCTO_API_URL;
const API_TOKEN = process.env.OCTO_API_TOKEN;

app.use(express.json());
app.use(cors());

// API
app.get('/api/profiles', async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?page_len=100&page=0&fields=title,description,proxy,start_pages,tags,status,last_active,version,storage_options,created_at,updated_at&ordering=active`,
      {
        headers: { 'X-Octo-Api-Token': API_TOKEN }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
