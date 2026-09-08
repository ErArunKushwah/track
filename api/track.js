export default async function handler(req, res) {
    // CORS पॉलिसी से बचने के लिए हेडर्स
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown IP";
            const userAgent = req.headers['user-agent'] || "Unknown Device";
            const body = req.body || {};

            const token = "8390339580:AAHgGBL-V3ya7JsCLs5e0lwYnIAEOypvtEE"; 
            const chatId = "1798743066"; 

            const textMessage = `🔔 *FIOMART AUTOMATIC ALERT* 🔔\n\n🌐 *IP:* \`${ip}\`\n📱 *Device:* \`${userAgent}\`\n🖥️ *Screen:* \`${body.screen || 'N/A'}\``;

            const tgUrl = `https://telegram.org{token}/sendMessage`;

            // टेलीग्राम सर्वर को डेटा पोस्ट करना
            const tgResponse = await fetch(tgUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textMessage,
                    parse_mode: "Markdown"
                })
            });

            const tgResult = await tgResponse.json();

            return res.status(200).json({ status: "success", telegram: tgResult.ok });
        } catch (err) {
            return res.status(500).json({ status: "error", message: err.message });
        }
    }
    
    return res.status(405).json({ error: "Method not allowed" });
}
