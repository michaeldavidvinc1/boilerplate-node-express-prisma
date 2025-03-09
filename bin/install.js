#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

// Cek apakah folder sudah ada isinya
if (fs.readdirSync(process.cwd()).length > 0) {
    console.error("❌ Folder ini tidak kosong! Jalankan di folder kosong.");
    process.exit(1);
}

console.log("🚀 Cloning boilerplate...");

// Clone repo langsung ke folder saat ini
try {
    execSync("git clone https://github.com/michaeldavidvinc1/boilerplate-node-express-prisma.git .", { stdio: "inherit" });

    // Hapus folder .git supaya user bisa pakai repo baru
    if (process.platform === "win32") {
        execSync("rmdir /s /q .git", { stdio: "inherit" }); // Windows
    } else {
        execSync("rm -rf .git", { stdio: "inherit" }); // Mac/Linux
    }

    // Copy .env.example ke .env jika belum ada
    if (!fs.existsSync(".env")) {
        fs.copyFileSync(".env.example", ".env");
        console.log("📄 Created .env file from .env.example");
    }

    console.log("📦 Installing dependencies...");
    execSync("npm install", { stdio: "inherit" });

    console.log("⚙️ Running Prisma setup...");
    execSync("npx prisma generate", { stdio: "inherit" });

    console.log("✅ Boilerplate siap digunakan!");
} catch (error) {
    console.error("❌ Terjadi kesalahan:", error.message);
    process.exit(1);
}
