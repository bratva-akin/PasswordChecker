# 🛡️ Shield Checker: Advanced Password Security Tool

A professional-grade, client-side password strength evaluator that focuses on mathematical entropy and real-world breach data.

## ✨ Features

* **Rule-Based Scoring:** Checks for length (8/12 chars), casing, numbers, and symbols.
* **Mathematical Entropy:** Displays "bits of security" based on character pool randomness.
* **HIBP Integration:** Real-time checking against billions of leaked passwords using the HIBP Range API.
* **Privacy-First:** Uses **SHA-1 k-Anonymity**. Your password is never sent to a server; only the first 5 characters of its hash are used for comparison.
* **Secure Generator:** Creates 16-character passwords using `window.crypto` (CSPRNG).
* **User Experience:** Includes a "Show/Hide" icon toggle and "Copy to Clipboard" functionality.



## 🚀 Tech Stack

- **Framework:** Tailwind CSS (via Play CDN)
- **Icons:** FontAwesome 6.0
- **Hashing:** Web Crypto API (SHA-1)
- **Deployment:** Single-file HTML/JS (zero dependencies)

## 🛠️ Logic Workflow

1.  **Input Event:** Triggers immediate local strength bar updates.
2.  **Debounce:** Waits 800ms after typing stops to prevent API rate-limiting.
3.  **Local Hash:** Generates a SHA-1 hex string in the browser.
4.  **Range Query:** Sends prefix to HIBP; browser performs the final match on the returned suffix list.

## 📝 License
MIT - Feel free to use this for your own projects!
