# CyberBrief
During my internship at Aramco, the SOC (Security Operations Center) team needed a better way to securely share cyber reports.
I developed CyberBrief, a platform that allows admins to upload and manage sensitive reports while authorized employees can securely access them.
The system integrates encryption, decryption, and a small-scale Public Key Infrastructure (PKI) to protect all confidential data.

# Our Mission
Our mission is simple: to provide a secure, centralized platform for cybersecurity teams to exchange reports and intelligence efficiently.
We aim to balance data confidentiality and accessibility, ensuring critical information reaches only the right hands.

# Our Vision
We envision a workplace where cybersecurity collaboration is both seamless and secure.
By combining encryption, user access control, and automated authorization, CyberBrief helps organizations strengthen their internal communication and protect sensitive cyber data.

# How to Start CyberBrief

## To start using CyberBrief, follow these steps:

    1. Install Node.js and a code editor (e.g., VS Code)
    
    2. Install the required packages
    npm install

    3. Start the backend server
    node server.js

    4. Start the frontend application
    npm start
    
    5. Start the backend server
    node server.js
    
    6. Start the frontend application
    npm start

    CyberBrief will run locally. Access it through your browser and enjoy secure report sharing!

# How to Use CyberBrief

## For Users

Users can register for an account to gain access to cyber reports.
Newly registered users must wait for admin approval before gaining full access.
Once approved, users can:
View and decrypt authorized cyber reports
Receive updates when new reports are uploaded
Manage their personal profile information
Log in using either credentials or digital certificates issued by the system

## For Admin
### Login Credentials:

Username: admin

Password: admin123

## Admins can:
Upload and manage encrypted cyber reports
Approve or reject new user registrations
Generate and email digital certificates for approved users (for certificate-based login)
Control user permissions and access
Monitor and delete reports when necessary
Security Implementation
CyberBrief was built with security at its core, using multiple cryptographic mechanisms to protect both data and user credentials.

## Encryption & Decryption
Files are encrypted and decrypted using AES (Advanced Encryption Standard) for symmetric encryption, while RSA is used to encrypt and protect the AES keys.
This ensures that only authorized users with valid keys can decrypt and access reports.

## Password Hashing
User passwords are hashed using bcrypt, which applies salted, iterative hashing to prevent credential exposure even if the database is compromised.

## Small-Scale PKI Implementation
CyberBrief includes a miniature Public Key Infrastructure (PKI) system:
When users are approved by the admin, they are automatically issued digital certificates (.crt and .pfx files).
These certificates are emailed to the user and can be used for secure login instead of traditional credentials.
The certificates are signed by a local Certificate Authority (CA) managed by the system administrator.
This layered approach provides confidentiality, integrity, and authentication for all report-sharing operations.

# Deployed Website
CyberBrief currently runs locally for testing and internal use.
To experience the system, clone the repository and run it on your local machine using the commands above.

# Internship Final Report
https://drive.google.com/file/d/1UcQ_9gtZULZZiB3Ohbcyv4zSn6fTHKX2/view?usp=sharing
