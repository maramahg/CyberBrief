const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { exec } = require("child_process");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Must be 32 bytes hex
const IV_LENGTH = 16;



function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(text) {
  if (!text) return "";
  const [ivHex, encryptedData] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}



const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";

// Middleware
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Database setup
const db = new sqlite3.Database("./socdaily.db", (err) => {
  if (err) console.error("❌ Failed to connect to DB:", err);
  else console.log("✅ Connected to SQLite database");
});

// Certificates directories
const CERT_DIR = path.join(__dirname, "ca");
const CA_DIR = path.join(__dirname, "ca");
if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR);


const upload = multer({ dest: "uploads/" });

// Users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT,
    role TEXT,
    approved INTEGER DEFAULT 0,
    certificatePath TEXT,
    pfxPath TEXT
  )
`);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
}

// ==================== USER SIGNUP ====================
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, existingUser) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, role, approved) VALUES (?, ?, ?, 'employee', 0)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) return res.status(500).json({ error: "Failed to create user" });

        res.json({ message: "Signup successful. Awaiting admin approval.", userId: this.lastID });
      }
    );
  });
});

// ==================== USER LOGIN ====================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  });
});

// ==================== CERTIFICATE LOGIN ====================
app.post("/api/login-certificate", upload.single("certificate"), (req, res) => {
  const certFilePath = req.file.path;
  const extractedCert = path.join(CERT_DIR, `temp-${Date.now()}.crt`);

  exec(
    `openssl pkcs12 -in "${certFilePath}" -clcerts -nokeys -out "${extractedCert}" -passin pass:1234`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ OpenSSL extraction error:", stderr);
        fs.unlinkSync(certFilePath);
        return res.status(400).json({ message: "Invalid certificate: Could not extract from PFX." });
      }

      if (!fs.existsSync(extractedCert)) {
        return res.status(400).json({ message: "Invalid certificate: No PEM file generated." });
      }

      const certText = fs.readFileSync(extractedCert, "utf8").trim();
      console.log("📄 Extracted certificate content:\n", certText);

      if (!certText || !certText.includes("BEGIN CERTIFICATE")) {
        return res.status(400).json({
          message: "Invalid certificate: Extracted certificate is empty or not in PEM format.",
        });
      }

      verifyCertificate(certText, res);

      fs.unlinkSync(extractedCert);
      fs.unlinkSync(certFilePath);
    }
  );
});

// ==================== VERIFY CERTIFICATE ====================
function normalizePEM(cert) {
  const match = cert.match(/-----BEGIN CERTIFICATE-----(.*?)-----END CERTIFICATE-----/s);
  if (match) {
    return match[1].replace(/\s+/g, "").trim();
  }
  return cert.replace(/\s+/g, "").trim();
}



function verifyCertificate(certText, res) {
  const uploadedCert = normalizePEM(certText);
  console.log("🔍 Uploaded certificate (normalized):", uploadedCert);

  db.all("SELECT * FROM users WHERE certificatePath IS NOT NULL", [], (err, users) => {
    if (err) return res.status(500).json({ message: "Database error" });

    for (const user of users) {
      const storedCert = fs.readFileSync(user.certificatePath, "utf8");
      const normalizedStoredCert = normalizePEM(storedCert);

      console.log(`🛠 Checking against user: ${user.username}`);
      console.log("Stored cert (normalized):", normalizedStoredCert);

      if (normalizedStoredCert === uploadedCert) {
        console.log("✅ Certificate matched for user:", user.username);
        const token = generateToken(user);
        return res.json({ token, role: user.role });
      }
    }

    console.log("❌ No certificate matched");
    return res.status(400).json({ message: "Invalid certificate: Certificate not recognized." });
  });
}


// ==================== GET PENDING USERS ====================
app.get("/api/admin/pending-users", (req, res) => {
  db.all("SELECT id, username, email, approved FROM users WHERE approved = 0", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch pending users" });
    res.json(rows);
  });
});

// ==================== ADMIN APPROVES USER ====================
app.post("/api/admin/approve/:userId", async (req, res) => {
  const userId = req.params.userId;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ message: "User not found" });

    const userName = user.username;
    const keyFile = path.join(CERT_DIR, `${userName}.key`);
    const csrFile = path.join(CERT_DIR, `${userName}.csr`);
    const crtFile = path.join(CERT_DIR, `${userName}.crt`);
    const pfxFile = path.join(CERT_DIR, `${userName}.pfx`);
    const caKey = path.join(CA_DIR, "ca.key");
    const caCrt = path.join(CA_DIR, "ca.crt");

    
    [keyFile, csrFile, crtFile, pfxFile].forEach((f) => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });

    exec(`openssl genrsa -out "${keyFile}" 2048`, (err) => {
      if (err) return res.status(500).json({ message: "Key generation failed" });

      exec(`openssl req -new -key "${keyFile}" -out "${csrFile}" -subj "/CN=${userName}"`, (err) => {
        if (err) return res.status(500).json({ message: "CSR generation failed" });

        exec(
          `openssl x509 -req -in "${csrFile}" -CA "${caCrt}" -CAkey "${caKey}" -CAcreateserial -out "${crtFile}" -days 365 -sha256`,
          (err) => {
            if (err) return res.status(500).json({ message: "Certificate signing failed" });

            exec(
              `openssl pkcs12 -export -out "${pfxFile}" -inkey "${keyFile}" -in "${crtFile}" -certfile "${caCrt}" -passout pass:1234`,
              (err) => {
                if (err) return res.status(500).json({ message: "PFX generation failed" });

                db.run(
                  "UPDATE users SET approved = 1, certificatePath = ?, pfxPath = ? WHERE id = ?",
                  [crtFile, pfxFile, userId],
                  async (err) => {
                    if (err) return res.status(500).json({ message: "Failed to update user" });

                    try {
                      await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: "Your Digital Certificate for CyberBrief Login",
                        text: `Hello ${user.username},\n\nYour account has been approved. Please find your login certificate attached.\n\nPassword for certificate: 1234\n\nBest Regards,\nCyberBrief Team`,
                        attachments: [
                          {
                            filename: `${userName}.pfx`,
                            path: pfxFile,
                          },
                        ],
                      });

                      res.json({
                        message: "User approved and certificate emailed successfully",
                        downloadLink: `/api/certificates/${userName}.pfx`,
                      });
                    } catch (emailError) {
                      console.error("❌ Email sending error:", emailError);
                      res.status(500).json({ message: "User approved, but email failed to send" });
                    }
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});

// ==================== ADMIN REJECTS USER ====================
app.delete("/api/admin/reject/:userId", (req, res) => {
  const userId = req.params.userId;
  db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to reject user" });
    res.json({ message: "User rejected and deleted" });
  });
});

// ==================== GET ALL INCIDENTS ====================
app.get("/api/incidents", (req, res) => {
  db.all("SELECT * FROM incidents", [], (err, rows) => {
    if (err) {
      console.error("❌ Failed to fetch incidents:", err);
      return res.status(500).json({ error: "Failed to fetch incidents" });
    }
    const decryptedRows = rows.map((row) => ({
  ...row,
  incidentTitle: decrypt(row.incidentTitle),
  incidentType: decrypt(row.incidentType),
  levelOfImportance: decrypt(row.levelOfImportance),
  affectedDivision: decrypt(row.affectedDivision),
  status: decrypt(row.status),
  incidentDate: decrypt(row.incidentDate),
  reporterEmail: decrypt(row.reporterEmail),
  description: decrypt(row.description),
}));

res.json(decryptedRows);

  });
});

// ==================== ADMIN SUBMIT INCIDENT ====================
app.post("/api/incidents", (req, res) => {
  const {
    incidentTitle,
    incidentType,
    levelOfImportance,
    affectedDivision,
    status,
    incidentDate,
    reporterEmail,
    description,
  } = req.body;

  if (
    !incidentTitle ||
    !incidentType ||
    !levelOfImportance ||
    !affectedDivision ||
    !status ||
    !incidentDate ||
    !reporterEmail ||
    !description
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
  `INSERT INTO incidents (
    incidentTitle,
    incidentType,
    levelOfImportance,
    affectedDivision,
    status,
    incidentDate,
    reporterEmail,
    description
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    encrypt(incidentTitle),
    encrypt(incidentType),
    encrypt(levelOfImportance),
    encrypt(affectedDivision),
    encrypt(status),
    encrypt(incidentDate),
    encrypt(reporterEmail),
    encrypt(description),
  ],

    function (err) {
      if (err) {
        console.error("❌ Failed to insert incident:", err);
        return res.status(500).json({ error: "Failed to submit incident" });
      }
      res.json({ message: "Incident submitted successfully", incidentId: this.lastID });
    }
  );
});



// ==================== DOWNLOAD PFX CERTIFICATE ====================
app.get("/api/certificates/:file", (req, res) => {
  const file = path.join(CERT_DIR, req.params.file);
  if (!fs.existsSync(file)) return res.status(404).send("File not found");
  res.download(file);
});

// ==================== START SERVER ====================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
