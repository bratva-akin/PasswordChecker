# 🛡️ Shield Checker: Advanced Password Security Tool

Shield Checker is a modern, client-side password strength evaluator and breach detector. It is designed to provide users with immediate, actionable feedback on their password security without compromising privacy.

## ✨ Features

* *Real-time Strength Meter:* Visual feedback based on complexity and length.
* *Shannon Entropy Calculation:* Measures the mathematical randomness (bits) of the password.
* *Leak Detection:* Integrated with the *Have I Been Pwned (HIBP)* API.
* *Privacy-First (k-Anonymity):* Passwords are hashed locally using SHA-1. Only the first 5 characters of the hash are sent to the API, ensuring your raw password is never exposed to the internet.
* *Secure Generator:* Uses a Cryptographically Secure Pseudorandom Number Generator (CSPRNG) to create 16-character high-entropy passwords.
* *Modern UI:* Built with *Tailwind CSS* for a clean, responsive, and accessible experience.
* *Copy-to-Clipboard:* Quickly copy generated passwords with one click.

## 🚀 Technologies Used

- *HTML5/JavaScript (ES6+)*
- *Tailwind CSS* (via CDN)
- *Web Crypto API* (for SHA-1 hashing and CSPRNG)
- *HIBP Pwned Passwords API*

## 🛠️ How it Works

1. *Local Analysis:* As the user types, the script checks for uppercase, lowercase, numbers, and special characters.
2. *Entropy Calculation:* The tool calculates entropy using the formula:
   $E = L \times \log_2(R)$
   (Where L is password length and R is the size of the character pool).
3. *Breach Check:* - The password is converted to a *SHA-1 hash*.
   - The script sends the *first 5 characters* (prefix) of the hash to api.pwnedpasswords.com.
   - The API returns a list of matching hash suffixes.
   - The browser checks the list locally to see if a match exists.



## 📦 Installation

No installation required! 

1. Copy the code into a file named index.html.
2. Open the file in any modern web browser (Chrome, Firefox, Safari, Edge).

## 🔒 Security Note
This tool is intended for educational and personal use. While it uses industry-standard k-Anonymity, always ensure you are using a trusted device when handling sensitive passwords.
