# 🚀 Matrix Social Media Bridge (Beeper Alternative - Side Hustle Project) 

A complete system to bridge WhatsApp/Instagram into a secure Matrix server. This project allows you to control a WhatsApp account programmatically or via a custom interface.

**Note:** This is an vibe coded project.
---

## 🛠 Prerequisites

Before running this, make sure you have:
1.  **Docker Desktop** (Running on your Mac)
2.  **Node.js & NPM**
3.  **Expo Go App** (On your physical phone)

---

## ⚙️ Step 1: Backend Setup (Docker)

The backend handles the server (Synapse) and the connection to WhatsApp (Mautrix Bridge).

1.  **Navigate to the backend folder:**
    ```bash
    cd unified-backend
    ```

2.  **Get your Local IP:**
    Run this in terminal: `ipconfig getifaddr en0` (or `en1`).
    *Note this down! We will call it `YOUR_MAC_IP`.*

3.  **Update Configuration:**
    Open `docker-compose.yml` and replace `YOUR_MAC_IP` with your actual IP.

4.  **Generate & Fix Configs (One-Time Setup):**
    Since we don't push passwords to GitHub, you must generate them locally:

    * **Generate Synapse Config:**
        ```bash
        docker run -it --rm -v "$PWD/synapse-data:/data" -e SYNAPSE_SERVER_NAME=YOUR_MAC_IP -e SYNAPSE_REPORT_STATS=no matrixdotorg/synapse:latest generate
        ```
    * **Edit `synapse-data/homeserver.yaml`:**
        - Change `enable_registration: false` → `true`
        - Change `bind_addresses: ['::1', '127.0.0.1']` → `['0.0.0.0']`
        - Add this to the very bottom:
          ```yaml
          app_service_config_files:
            - /data/registration.yaml
          ```

    * **Setup Bridge Config:**
        Create a file `whatsapp-data/config.yaml` and paste this (Update `YOUR_MAC_IP`):
        ```yaml
        homeserver:
          address: http://synapse:8008
          domain: YOUR_MAC_IP
        appservice:
          address: http://mautrix-whatsapp:29318
          hostname: 0.0.0.0
          port: 29318
          database: { type: sqlite3, uri: file:/data/whatsapp.db }
          id: whatsapp
          bot: { username: whatsappbot, displayname: WhatsApp Bridge }
          as_token: "temp_as"
          hs_token: "temp_hs"
        network: { mode: default }
        bridge:
          permissions: { "*": "relay", "YOUR_MAC_IP": "user", "@admin:YOUR_MAC_IP": "admin" }
          relay: { enabled: true, admin_only: true }
        logging: { print_level: debug }
        ```

    * **Generate Registration File:**
        ```bash
        docker run --rm -v "$PWD/whatsapp-data:/data" dock.mau.dev/mautrix/whatsapp:latest
        cp whatsapp-data/registration.yaml synapse-data/registration.yaml
        ```

5.  **Start the Server:**
    ```bash
    docker-compose up -d
    ```

6.  **Create Admin User:**
    ```bash
    docker exec -it synapse register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml -u admin -p password123 --admin
    ```

---

## 📱 Step 2: Frontend Setup (React Native)

The mobile app is used to scan the QR code and link your device.

1.  **Navigate to the frontend folder:**
    ```bash
    cd ../WhatsAppLogin
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure IP:**
    Open `App.js`.
    Find the `HOMESERVER` and `BOT_ID` constants at the top.
    Replace `192.168.X.X` with your **`YOUR_MAC_IP`**.

4.  **Run the App:**
    ```bash
    npx expo start --clear
    ```
    Scan the QR code with your phone using the **Expo Go** app.

---

## 🔗 Step 3: Connect WhatsApp

1.  On the App, wait for **"Client Ready"** logs.
2.  Tap **Start Setup** (This invites the bot).
3.  Tap **Send Login**.
4.  A **QR Code** will appear in the app logs.
5.  Open **WhatsApp** on your real phone → **Linked Devices** → **Link a Device**.
6.  Scan the QR code shown on the Expo app.

🎉 **Success!** Your WhatsApp is now bridged to your Matrix server.

---

## 🛑 Troubleshooting

* **App crashes on startup?** Make sure `YOUR_MAC_IP` is correct in `App.js` and your phone is on the same Wi-Fi.
* **Bot doesn't reply?** Run `docker restart mautrix-whatsapp`.
* **Connection Refused?** Ensure Docker is running (`docker ps`).
