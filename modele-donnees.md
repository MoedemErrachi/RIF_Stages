# Modèle de Données — RIF Stages

## Vue d'ensemble

Application de gestion de candidatures aux offres de stage, avec workflow de validation RH et notifications automatiques par email.

**Stack** : MySQL

---

## 1. Diagramme Entité-Association (texte)

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────────────┐
│      User        │         │      Offre        │         │     Candidature       │
├─────────────────┤         ├─────────────────┤         ├──────────────────────┤
│ id PK             │◄───┐    │ id PK              │◄───┐    │ id PK                  │
│ nom                │    │    │ titre              │    │    │ candidat_id FK ────────┼──┐
│ prenom             │    │    │ description        │    │    │ offre_id FK ───────────┼──┤
│ email UNIQUE       │    │    │ specialite         │    │    │ cv_url                 │  │
│ password_hash      │    │    │ statut             │    │    │ lettre_motivation      │  │
│ telephone           │    │    │ created_by FK ─────┼────┘    │ statut                 │  │
│ role                │    │    │ date_creation      │         │ commentaire_rh         │  │
│ created_at          │    │    └─────────────────┘         │ traite_par FK ──────────┼──┘
└─────────────────┘    │                                     │ date_soumission        │
        ▲               │                                     │ date_maj               │
        │               │                                     └──────────────────────┘
        │               │                                              │
        │               └──────────────────────────────────────────────┘
        │                                                               │
        │                                              ┌────────────────┴────────────────┐
        │                                              ▼                                   ▼
        │                              ┌──────────────────────────┐    ┌──────────────────────┐
        │                              │  CandidatureStatusLog     │    │   NotificationLog      │
        │                              ├──────────────────────────┤    ├──────────────────────┤
        │                              │ id PK                      │    │ id PK                  │
        └──────────────────────────────┤ candidature_id FK          │    │ candidature_id FK      │
                                         │ ancien_statut              │    │ type                   │
                                         │ nouveau_statut             │    │ destinataire           │
                                         │ change_par FK ──────────────    │ envoye_le              │
                                         │ date_changement            │    │ statut_envoi           │
                                         └──────────────────────────┘    └──────────────────────┘
```

---

## 2. Description des entités

### User
Table unifiée pour les candidats et le personnel RH, différenciés par le champ `role`.

| Champ | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| nom | VARCHAR(100) | NOT NULL |
| prenom | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| telephone | VARCHAR(20) | NULL |
| role | ENUM('candidat', 'rh', 'admin') | NOT NULL, DEFAULT 'candidat' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### Offre
Représente une offre de stage publiée par un membre RH.

| Champ | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| titre | VARCHAR(150) | NOT NULL |
| description | TEXT | NOT NULL |
| specialite | VARCHAR(100) | NOT NULL |
| statut | ENUM('ouverte', 'fermee') | DEFAULT 'ouverte' |
| created_by | INT | FK → User.id |
| date_creation | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### Candidature
Cœur du workflow : lie un candidat à une offre, avec suivi du statut de traitement.

| Champ | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| candidat_id | INT | FK → User.id |
| offre_id | INT | FK → Offre.id |
| cv_url | VARCHAR(255) | NOT NULL |
| lettre_motivation | TEXT | NULL |
| statut | ENUM('soumise', 'en_revue', 'acceptee', 'refusee') | DEFAULT 'soumise' |
| commentaire_rh | TEXT | NULL |
| traite_par | INT | FK → User.id, NULL |
| date_soumission | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| date_maj | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### CandidatureStatusLog
Historique complet des changements de statut d'une candidature (traçabilité).

| Champ | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| candidature_id | INT | FK → Candidature.id |
| ancien_statut | VARCHAR(20) | NULL |
| nouveau_statut | VARCHAR(20) | NOT NULL |
| change_par | INT | FK → User.id, NULL |
| date_changement | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### NotificationLog
Trace chaque email envoyé automatiquement par le système (preuve d'automatisation).

| Champ | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| candidature_id | INT | FK → Candidature.id |
| type | ENUM('soumission', 'changement_statut') | NOT NULL |
| destinataire | VARCHAR(150) | NOT NULL |
| envoye_le | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| statut_envoi | ENUM('succes', 'echec') | DEFAULT 'succes' |

---

## 3. Relations (cardinalités)

| Relation | Type | Description |
|---|---|---|
| User → Offre | 1,N | Un utilisateur RH peut créer plusieurs offres |
| User → Candidature (candidat_id) | 1,N | Un candidat peut soumettre plusieurs candidatures |
| User → Candidature (traite_par) | 1,N | Un RH peut traiter plusieurs candidatures |
| Offre → Candidature | 1,N | Une offre peut recevoir plusieurs candidatures |
| Candidature → CandidatureStatusLog | 1,N | Une candidature a un historique de statuts |
| Candidature → NotificationLog | 1,N | Une candidature génère plusieurs notifications |

---

## 4. Script SQL de création

```sql
CREATE DATABASE IF NOT EXISTS rif_stages;
USE rif_stages;

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NULL,
    role ENUM('candidat', 'rh', 'admin') NOT NULL DEFAULT 'candidat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Offre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    specialite VARCHAR(100) NOT NULL,
    statut ENUM('ouverte', 'fermee') DEFAULT 'ouverte',
    created_by INT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(id)
);

CREATE TABLE Candidature (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidat_id INT NOT NULL,
    offre_id INT NOT NULL,
    cv_url VARCHAR(255) NOT NULL,
    lettre_motivation TEXT NULL,
    statut ENUM('soumise', 'en_revue', 'acceptee', 'refusee') DEFAULT 'soumise',
    commentaire_rh TEXT NULL,
    traite_par INT NULL,
    date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_maj DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidat_id) REFERENCES User(id),
    FOREIGN KEY (offre_id) REFERENCES Offre(id),
    FOREIGN KEY (traite_par) REFERENCES User(id)
);

CREATE TABLE CandidatureStatusLog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidature_id INT NOT NULL,
    ancien_statut VARCHAR(20) NULL,
    nouveau_statut VARCHAR(20) NOT NULL,
    change_par INT NULL,
    date_changement DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidature_id) REFERENCES Candidature(id),
    FOREIGN KEY (change_par) REFERENCES User(id)
);

CREATE TABLE NotificationLog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidature_id INT NOT NULL,
    type ENUM('soumission', 'changement_statut') NOT NULL,
    destinataire VARCHAR(150) NOT NULL,
    envoye_le DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut_envoi ENUM('succes', 'echec') DEFAULT 'succes',
    FOREIGN KEY (candidature_id) REFERENCES Candidature(id)
);
```

---

## 5. Notes techniques

- **Indexation recommandée** : ajouter un index sur `Candidature.statut` et `Candidature.offre_id` pour accélérer les filtres du dashboard RH.
- **Sécurité** : `password_hash` doit être généré via bcrypt (jamais de mot de passe en clair).
- **Intégrité référentielle** : toutes les FK utilisent `RESTRICT` par défaut ; envisager `ON DELETE CASCADE` sur `CandidatureStatusLog` et `NotificationLog` si une candidature est supprimée.
