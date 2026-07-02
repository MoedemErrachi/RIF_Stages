/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from './data.js';

const DATA_FILE = path.join(process.cwd(), 'db.json');

let pool = null;
let useMySQL = false;

// Attempt to initialize MySQL pool if config exists
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  multipleStatements: true,
};

if (mysqlConfig.host && mysqlConfig.user) {
  try {
    console.log('MySQL configurations detected. Testing connection...');
    useMySQL = true;
  } catch (err) {
    console.error('Failed to prepare MySQL config.', err);
    useMySQL = false;
  }
}

// Initialize tables or JSON file
export async function initializeDatabase() {
  if (useMySQL) {
    try {
      // 1. Connect without database to create it if not exists
      const tempConnection = await mysql.createConnection(mysqlConfig);
      await tempConnection.query('CREATE DATABASE IF NOT EXISTS rif_stages;');
      await tempConnection.end();

      // 2. Connect with database
      pool = mysql.createPool({
        ...mysqlConfig,
        database: 'rif_stages',
        connectionLimit: 10,
        multipleStatements: true
      });

      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database rif_stages!');
      
      // Create tables according to modele-donnees.md
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            telephone VARCHAR(20) NULL,
            role ENUM('candidat', 'rh', 'admin') NOT NULL DEFAULT 'candidat',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS Offre (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titre VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            specialite VARCHAR(100) NOT NULL,
            duree VARCHAR(50) NULL,
            localisation VARCHAR(150) NULL,
            statut ENUM('ouverte', 'fermee') DEFAULT 'ouverte',
            created_by INT NOT NULL,
            date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE
        );
      `);

      // Add columns if they don't exist yet (migration for existing tables)
      await connection.query(`ALTER TABLE Offre ADD COLUMN IF NOT EXISTS duree VARCHAR(50) NULL`).catch(() => {});
      await connection.query(`ALTER TABLE Offre ADD COLUMN IF NOT EXISTS localisation VARCHAR(150) NULL`).catch(() => {});

      await connection.query(`
        CREATE TABLE IF NOT EXISTS Candidature (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidat_id INT NOT NULL,
            offre_id INT NOT NULL,
            cv_url VARCHAR(255) NOT NULL,
            lettre_motivation TEXT,
            statut ENUM('soumise', 'en_revue', 'acceptee', 'refusee') DEFAULT 'soumise',
            commentaire_rh TEXT NULL,
            traite_par INT NULL,
            date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
            date_maj DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE(candidat_id, offre_id),
            FOREIGN KEY (candidat_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (offre_id) REFERENCES Offre(id) ON DELETE CASCADE,
            FOREIGN KEY (traite_par) REFERENCES Users(id) ON DELETE SET NULL
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS CandidatureStatusLog (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidature_id INT NOT NULL,
            ancien_statut ENUM('soumise', 'en_revue', 'acceptee', 'refusee') NULL,
            nouveau_statut ENUM('soumise', 'en_revue', 'acceptee', 'refusee') NOT NULL,
            change_par INT NULL,
            date_changement DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (candidature_id) REFERENCES Candidature(id) ON DELETE CASCADE,
            FOREIGN KEY (change_par) REFERENCES Users(id) ON DELETE SET NULL
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS NotificationLog (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidature_id INT NOT NULL,
            type ENUM('soumission', 'changement_statut') NOT NULL,
            destinataire VARCHAR(150) NOT NULL,
            envoye_le DATETIME DEFAULT CURRENT_TIMESTAMP,
            statut_envoi ENUM('succes', 'echec') DEFAULT 'succes',
            FOREIGN KEY (candidature_id) REFERENCES Candidature(id) ON DELETE CASCADE
        );
      `);

      // Seed default users if empty
      const [userRows] = await pool.query('SELECT COUNT(*) as count FROM Users');
      if (userRows[0].count === 0) {
        console.log('Seeding initial users...');
        // Use bcrypt to hash passwords for seeded users
        const bcrypt = await import('bcrypt');
        const adminHash = await bcrypt.hash('admin123', 10);
        const candidatHash = await bcrypt.hash('candidat123', 10);
        await pool.query(`
          INSERT INTO Users (nom, prenom, email, password_hash, role) VALUES 
          ('Admin', 'Super', 'rh@example.com', ?, 'rh'),
          ('Martin', 'Sophie', 'rh2@example.com', ?, 'rh'),
          ('Demo', 'Candidat', 'candidat.demo@example.com', ?, 'candidat'),
          ('Dupont', 'Jean', 'jean.dupont@example.com', ?, 'candidat'),
          ('Leroy', 'Marie', 'marie.leroy@example.com', ?, 'candidat')
        `, [adminHash, adminHash, candidatHash, candidatHash, candidatHash]);
      }

      // We won't seed data.js into MySQL as the structures differ greatly, 
      // let's start fresh or use the JSON fallback for old data.
      
      connection.release();
    } catch (err) {
      console.error('MySQL connection or migration failed. Falling back to local db.json storage.', err);
      useMySQL = false;
      initJSONFile();
    }
  } else {
    initJSONFile();
  }
}

function initJSONFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      internships: INITIAL_INTERNSHIPS,
      applications: INITIAL_APPLICATIONS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function loadJSONData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading db.json, returning defaults', e);
  }
  return { internships: INITIAL_INTERNSHIPS, applications: INITIAL_APPLICATIONS };
}

function saveJSONData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- HELPER MAPPERS ---
function mapOffreToInternship(row) {
  return {
    id: row.id.toString(),
    title: row.titre,
    company: 'Entreprise RIF',
    specialty: row.specialite,
    duration: row.duree || 'Non spécifié',
    location: row.localisation || 'Non spécifié',
    description: row.description,
    status: row.statut === 'ouverte' ? 'Ouverte' : 'Fermée',
    applicantsCount: row.applicantsCount || 0,
    publishedAt: row.date_creation,
    skills: [],
    requirements: []
  };
}

function mapCandidatureToApplication(row) {
  return {
    id: row.id.toString(),
    internshipId: row.offre_id.toString(),
    internshipTitle: row.offre_titre || 'Offre',
    candidateLastName: row.candidat_nom || 'Candidat',
    candidateFirstName: row.candidat_prenom || '',
    candidateEmail: row.candidat_email || '',
    candidatePhone: row.candidat_telephone || '',
    cvName: row.cv_url,
    motivation: row.lettre_motivation || '',
    status: mapStatutToStatus(row.statut),
    history: [], // Would need to fetch from CandidatureStatusLog in a real app, keeping empty for now to match UI
    comments: row.commentaire_rh || '',
    submittedAt: row.date_soumission
  };
}

function mapStatutToStatus(statut) {
  switch (statut) {
    case 'soumise': return 'Soumise';
    case 'en_revue': return 'En revue';
    case 'acceptee': return 'Acceptée';
    case 'refusee': return 'Refusée';
    default: return 'Soumise';
  }
}

function mapStatusToStatut(status) {
  switch (status) {
    case 'Soumise': return 'soumise';
    case 'En revue': return 'en_revue';
    case 'Acceptée': return 'acceptee';
    case 'Refusée': return 'refusee';
    default: return 'soumise';
  }
}

// --- INTERNSHIPS API ---

export async function getInternships() {
  if (useMySQL && pool) {
    try {
      const [rows] = await pool.query(`
        SELECT o.*, COUNT(c.id) as applicantsCount 
        FROM Offre o 
        LEFT JOIN Candidature c ON o.id = c.offre_id 
        GROUP BY o.id
      `);
      return rows.map(mapOffreToInternship);
    } catch (err) {
      console.error('MySQL query error in getInternships:', err);
    }
  }
  return loadJSONData().internships;
}

export async function addInternship(offer) {
  if (useMySQL && pool) {
    try {
      const statut = offer.status === 'Fermée' ? 'fermee' : 'ouverte';
      const duree = offer.duration || null;
      const localisation = offer.location || null;
      const [result] = await pool.query(
        'INSERT INTO Offre (titre, description, specialite, duree, localisation, statut, created_by) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [offer.title, offer.description || '', offer.specialty || '', duree, localisation, statut]
      );
      const [rows] = await pool.query(
        'SELECT o.*, COUNT(c.id) as applicantsCount FROM Offre o LEFT JOIN Candidature c ON o.id = c.offre_id WHERE o.id = ? GROUP BY o.id',
        [result.insertId]
      );
      return mapOffreToInternship(rows[0]);
    } catch (err) {
      console.error('MySQL query error in addInternship:', err);
    }
  }
  
  const db = loadJSONData();
  const id = `internship-${Date.now()}`;
  const newOffer = { ...offer, id, applicantsCount: 0, publishedAt: new Date().toISOString() };
  db.internships = [newOffer, ...db.internships];
  saveJSONData(db);
  return newOffer;
}

export async function toggleInternshipStatus(id) {
  if (useMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT statut FROM Offre WHERE id = ?', [id]);
      if (rows.length > 0) {
        const newStatut = rows[0].statut === 'ouverte' ? 'fermee' : 'ouverte';
        await pool.query('UPDATE Offre SET statut = ? WHERE id = ?', [newStatut, id]);
        
        const [updatedRows] = await pool.query('SELECT * FROM Offre WHERE id = ?', [id]);
        return mapOffreToInternship(updatedRows[0]);
      }
    } catch (err) {
      console.error('MySQL query error in toggleInternshipStatus:', err);
    }
  }
  return null;
}

export async function deleteInternship(id) {
  if (useMySQL && pool) {
    try {
      await pool.query('DELETE FROM Offre WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL query error in deleteInternship:', err);
    }
  }
  return false;
}

// --- APPLICATIONS API ---

export async function getApplications() {
  if (useMySQL && pool) {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, 
               o.titre as offre_titre, 
               u.nom as candidat_nom, u.prenom as candidat_prenom, u.email as candidat_email, u.telephone as candidat_telephone
        FROM Candidature c
        JOIN Offre o ON c.offre_id = o.id
        JOIN Users u ON c.candidat_id = u.id
      `);
      return rows.map(mapCandidatureToApplication);
    } catch (err) {
      console.error('MySQL query error in getApplications:', err);
    }
  }
  return loadJSONData().applications;
}

export async function addApplication(appData) {
  if (useMySQL && pool) {
    try {
      // Ensure candidate user exists
      let [users] = await pool.query('SELECT id FROM Users WHERE email = ?', [appData.candidateEmail]);
      let candidat_id;
      if (users.length === 0) {
        // Auto-create a candidate user with a random secure password
        const bcryptLib = await import('bcrypt');
        const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        const tempHash = await bcryptLib.hash(tempPassword, 10);
        const [insertUser] = await pool.query(
          'INSERT INTO Users (nom, prenom, email, password_hash, telephone, role) VALUES (?, ?, ?, ?, ?, ?)',
          [appData.candidateLastName || 'Candidat', appData.candidateFirstName || '', appData.candidateEmail, tempHash, appData.candidatePhone || null, 'candidat']
        );
        candidat_id = insertUser.insertId;
      } else {
        candidat_id = users[0].id;
      }

      // Add candidature
      const [insertApp] = await pool.query(
        'INSERT INTO Candidature (candidat_id, offre_id, cv_url, lettre_motivation, statut) VALUES (?, ?, ?, ?, ?)',
        [candidat_id, parseInt(appData.internshipId), appData.cvName || 'cv.pdf', appData.motivation || '', 'soumise']
      );

      // Add status log
      await pool.query(
        'INSERT INTO CandidatureStatusLog (candidature_id, nouveau_statut) VALUES (?, ?)',
        [insertApp.insertId, 'soumise']
      );

      // Add notification log
      await pool.query(
        'INSERT INTO NotificationLog (candidature_id, type, destinataire) VALUES (?, ?, ?)',
        [insertApp.insertId, 'soumission', appData.candidateEmail]
      );

      // Return created app mapped
      const [rows] = await pool.query(`
        SELECT c.*, o.titre as offre_titre, u.nom as candidat_nom, u.prenom as candidat_prenom, u.email as candidat_email, u.telephone as candidat_telephone
        FROM Candidature c JOIN Offre o ON c.offre_id = o.id JOIN Users u ON c.candidat_id = u.id
        WHERE c.id = ?
      `, [insertApp.insertId]);
      return mapCandidatureToApplication(rows[0]);
    } catch (err) {
      console.error('MySQL query error in addApplication:', err);
    }
  }
  return null;
}

export async function updateApplicationStatus(id, status, comment) {
  if (useMySQL && pool) {
    try {
      const dbStatut = mapStatusToStatut(status);
      const [current] = await pool.query('SELECT statut, candidat_id FROM Candidature WHERE id = ?', [id]);
      if (current.length === 0) return null;
      
      const ancien_statut = current[0].statut;

      // Update candidature
      await pool.query(
        'UPDATE Candidature SET statut = ?, commentaire_rh = COALESCE(?, commentaire_rh), traite_par = 1 WHERE id = ?',
        [dbStatut, comment || null, id]
      );

      // Log change
      await pool.query(
        'INSERT INTO CandidatureStatusLog (candidature_id, ancien_statut, nouveau_statut, change_par) VALUES (?, ?, ?, 1)',
        [id, ancien_statut, dbStatut]
      );

      // Get email of candidate
      const [user] = await pool.query('SELECT email FROM Users WHERE id = ?', [current[0].candidat_id]);

      // Notification log
      await pool.query(
        'INSERT INTO NotificationLog (candidature_id, type, destinataire) VALUES (?, ?, ?)',
        [id, 'changement_statut', user[0].email]
      );

      const [rows] = await pool.query(`
        SELECT c.*, o.titre as offre_titre, u.nom as candidat_nom, u.prenom as candidat_prenom, u.email as candidat_email, u.telephone as candidat_telephone
        FROM Candidature c JOIN Offre o ON c.offre_id = o.id JOIN Users u ON c.candidat_id = u.id
        WHERE c.id = ?
      `, [id]);
      return mapCandidatureToApplication(rows[0]);
    } catch (err) {
      console.error('MySQL query error in updateApplicationStatus:', err);
    }
  }
  return null;
}

export async function updateApplicationComment(id, comment) {
  if (useMySQL && pool) {
    try {
      await pool.query('UPDATE Candidature SET commentaire_rh = ? WHERE id = ?', [comment, id]);
      
      const [rows] = await pool.query(`
        SELECT c.*, o.titre as offre_titre, u.nom as candidat_nom, u.prenom as candidat_prenom, u.email as candidat_email, u.telephone as candidat_telephone
        FROM Candidature c JOIN Offre o ON c.offre_id = o.id JOIN Users u ON c.candidat_id = u.id
        WHERE c.id = ?
      `, [id]);
      return mapCandidatureToApplication(rows[0]);
    } catch (err) {
      console.error('MySQL query error in updateApplicationComment:', err);
    }
  }
  return null;
}

// --- AUTH API ---

export async function getUserByEmail(email) {
  if (useMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (err) {
      console.error('MySQL query error in getUserByEmail:', err);
    }
  }
  return null;
}

export async function createUser(nom, prenom, email, passwordHash, telephone, role) {
  if (useMySQL && pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Users (nom, prenom, email, password_hash, telephone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, prenom, email, passwordHash, telephone || null, role]
      );
      const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [result.insertId]);
      return rows[0];
    } catch (err) {
      console.error('MySQL query error in createUser:', err);
    }
  }
  return null;
}

export async function updateUserPasswordByEmail(email, passwordHash) {
  if (useMySQL && pool) {
    try {
      const [result] = await pool.query(
        'UPDATE Users SET password_hash = ? WHERE email = ?',
        [passwordHash, email]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('MySQL query error in updateUserPasswordByEmail:', err);
    }
  }
  return false;
}
