/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  initializeDatabase,
  getInternships,
  addInternship,
  toggleInternshipStatus,
  deleteInternship,
  getApplications,
  addApplication,
  updateApplicationStatus,
  updateApplicationComment
} from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQL or JSON tables on startup
try {
  await initializeDatabase();
  console.log("Database subsystem initialized successfully.");
} catch (err) {
  console.error("Critical error during database initialization:", err);
}

// 1. API: Internships
app.get("/api/internships", async (req, res) => {
  try {
    const list = await getInternships();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des offres." });
  }
});

app.post("/api/internships", async (req, res) => {
  try {
    const newOffer = await addInternship(req.body);
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'offre." });
  }
});

app.put("/api/internships/:id/toggle", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedOffer = await toggleInternshipStatus(id);
    if (!updatedOffer) {
      return res.status(404).json({ error: "Offre de stage non trouvée" });
    }
    res.json(updatedOffer);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de l'offre." });
  }
});

app.delete("/api/internships/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const success = await deleteInternship(id);
    if (!success) {
      return res.status(404).json({ error: "Offre de stage non trouvée" });
    }
    res.json({ success: true, message: "Offre de stage supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'offre." });
  }
});

// 2. API: Applications
app.get("/api/applications", async (req, res) => {
  try {
    const list = await getApplications();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des candidatures." });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const newApp = await addApplication(req.body);
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la soumission de la candidature." });
  }
});

app.put("/api/applications/:id/status", async (req, res) => {
  try {
    const id = req.params.id;
    const { status, comment } = req.body;
    const updatedApp = await updateApplicationStatus(id, status, comment);
    if (!updatedApp) {
      return res.status(404).json({ error: "Candidature non trouvée" });
    }
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la candidature." });
  }
});

app.put("/api/applications/:id/comment", async (req, res) => {
  try {
    const id = req.params.id;
    const { comment } = req.body;
    const updatedApp = await updateApplicationComment(id, comment);
    if (!updatedApp) {
      return res.status(404).json({ error: "Candidature non trouvée" });
    }
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du commentaire." });
  }
});

// 3. AI: Auto-response email writer with Gemini API
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

app.post("/api/ai/generate-email", async (req, res) => {
  const { candidateName, internshipTitle, status, comments } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "La clé API Gemini (GEMINI_API_KEY) n'est pas configurée sur le serveur." });
  }
  if (!ai) {
    return res.status(500).json({ error: "Le client d'intégration Gemini API n'a pas pu être initialisé." });
  }

  const prompt = `Rédige un email professionnel, poli, bienveillant et en français à l'attention du candidat nommé ${candidateName} concernant sa candidature pour le stage "${internshipTitle}".
Le statut actuel de sa candidature est: "${status}".
${comments ? `Prends en compte les commentaires de l'équipe de recrutement suivants pour personnaliser l'email: "${comments}".` : ""}

Consignes de rédaction:
- L'expéditeur est "TechCorp Solutions RH".
- L'email doit comporter un objet clair, une salutation professionnelle, le corps du message chaleureux et constructif (et contenant des détails pertinents si le statut est "Acceptée" ou "Refusée"), et une signature formelle.
- Ne mentionne pas de détails de logs internes ou d'informations techniques sur l'application.
- Si le statut est "Acceptée", indique de manière claire et enthousiaste qu'une convention de stage lui sera partagée sous peu.
- Si le statut est "Refusée", reste extrêmement poli, positif, encourageant et formule des vœux de réussite sincères pour ses recherches futures.
- Reste concis, pas de blabla inutile.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    res.json({ emailText: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la génération de l'email par l'IA.", details: error.message });
  }
});

// Vite & Static assets integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
