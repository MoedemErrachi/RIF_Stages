/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { MailtrapTransport } from "mailtrap";
import {
  initializeDatabase,
  getInternships,
  addInternship,
  toggleInternshipStatus,
  deleteInternship,
  getApplications,
  addApplication,
  updateApplicationStatus,
  updateApplicationComment,
  getUserByEmail,
  createUser,
  updateUserPasswordByEmail
} from "./db.js";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-rif';

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'backend', 'uploads', 'cv'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ storage: storage });

// Initialize SQL or JSON tables on startup
try {
  await initializeDatabase();
  console.log("Database subsystem initialized successfully.");
} catch (err) {
  console.error("Critical error during database initialization:", err);
}

// Initialize Nodemailer with Mailtrap
let transporter = null;
try {
  const token = process.env.MAILTRAP_TOKEN || "4cd3c42184f258e3412ffa89b3b6c9ef"; // Fallback to provided token for testing
  transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: token,
    })
  );
  console.log("Nodemailer: Mailtrap transport initialized.");
} catch (err) {
  console.error("Failed to initialize Nodemailer Mailtrap transport", err);
}

// --- AUTHENTICATION ---

// Middleware to verify JWT and attach user to request
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error('JWT verification failed', err);
    return res.sendStatus(403);
  }
}
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, role } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(nom, prenom, email, passwordHash, telephone, role || 'candidat');
    if (!newUser) {
      return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    const token = jwt.sign({ id: user.id, role: user.role, nom: user.nom, prenom: user.prenom, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Endpoint to get current authenticated user
app.get('/api/auth/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// DEV ONLY: Fix broken 'hash' passwords in DB for demo accounts
app.post('/api/auth/fix-passwords', async (req, res) => {
  try {
    const demoAccounts = [
      { email: 'rh@example.com', password: 'admin123', nom: 'Admin', prenom: 'Super', role: 'rh' },
      { email: 'rh2@example.com', password: 'admin123', nom: 'Martin', prenom: 'Sophie', role: 'rh' },
      { email: 'candidat.demo@example.com', password: 'candidat123', nom: 'Demo', prenom: 'Candidat', role: 'candidat' },
      { email: 'jean.dupont@example.com', password: 'candidat123', nom: 'Dupont', prenom: 'Jean', role: 'candidat' },
      { email: 'marie.leroy@example.com', password: 'candidat123', nom: 'Leroy', prenom: 'Marie', role: 'candidat' },
    ];

    const results = [];
    for (const acc of demoAccounts) {
      const hash = await bcrypt.hash(acc.password, 10);
      const existing = await getUserByEmail(acc.email);
      if (existing) {
        const updated = await updateUserPasswordByEmail(acc.email, hash);
        results.push({ email: acc.email, status: updated ? 'password_fixed' : 'update_failed' });
      } else {
        await createUser(acc.nom, acc.prenom, acc.email, hash, null, acc.role);
        results.push({ email: acc.email, status: 'created' });
      }
    }
    res.json({ message: 'Passwords fixed successfully!', results });
  } catch (err) {
    console.error('fix-passwords error:', err);
    res.status(500).json({ error: err.message });
  }
});

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

app.post("/api/applications", upload.single('cvFile'), async (req, res) => {
  try {
    const body = req.body;
    const appData = {
      internshipId: body.internshipId,
      internshipTitle: body.internshipTitle,
      candidateLastName: body.candidateLastName || body.lastName,
      candidateFirstName: body.candidateFirstName || body.firstName,
      candidatePhone: body.candidatePhone || body.phone,
      candidateEmail: body.candidateEmail || 'candidat@example.com',
      motivation: body.motivation,
      cvName: req.file ? '/uploads/cv/' + req.file.filename : (body.cvName || 'cv.pdf'),
    };
    if (!appData.internshipId) {
      return res.status(400).json({ error: "L'ID de l'offre est requis." });
    }
    const newApp = await addApplication(appData);
    if (!newApp) {
      return res.status(500).json({ error: "Erreur lors de l'enregistrement de la candidature." });
    }
    res.status(201).json(newApp);
  } catch (err) {
    console.error('Error in POST /api/applications:', err);
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

    // Automatisation de l'email si Acceptée ou Refusée
    if ((status === 'Acceptée' || status === 'Refusée') && transporter && ai) {
      try {
        const candidateName = `${updatedApp.candidateFirstName} ${updatedApp.candidateLastName}`;
        const internshipTitle = updatedApp.internshipTitle;
        const prompt = `Rédige un email professionnel, poli, bienveillant et en français à l'attention du candidat nommé ${candidateName} concernant sa candidature pour le stage "${internshipTitle}".
Le statut actuel de sa candidature est: "${status}".
${comment ? `Prends en compte les commentaires de l'équipe de recrutement suivants pour personnaliser l'email: "${comment}".` : ""}

Consignes de rédaction:
- L'expéditeur est "TechCorp Solutions RH".
- L'email doit comporter un objet clair, une salutation professionnelle, le corps du message chaleureux et constructif (et contenant des détails pertinents si le statut est "Acceptée" ou "Refusée"), et une signature formelle.
- Ne mentionne pas de détails de logs internes ou d'informations techniques sur l'application.
- Si le statut est "Acceptée", indique de manière claire et enthousiaste qu'une convention de stage lui sera partagée sous peu.
- Si le statut est "Refusée", reste extrêmement poli, positif, encourageant et formule des vœux de réussite sincères pour ses recherches futures.
- Reste concis, pas de blabla inutile.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        const emailText = response.text;

        const sender = {
          address: process.env.MAIL_FROM_ADDRESS || "noreply@rifstages.tn",
          name: process.env.MAIL_FROM_NAME || "RIF Stages Platform",
        };

        const info = await transporter.sendMail({
          from: sender,
          to: [updatedApp.candidateEmail], // Important: Mailtrap expects an array of recipients for 'to' field
          subject: `Suite à votre candidature : ${internshipTitle}`,
          text: emailText,
          category: "Candidature Response",
        });

        console.log("Email automatique envoyé via Mailtrap!");
      } catch (emailErr) {
        console.error("Erreur lors de la génération ou de l'envoi de l'email:", emailErr);
      }
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
