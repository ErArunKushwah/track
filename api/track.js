export default async function handler(req, res) {
    // CORS सुरक्षा हेडर
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

            // ✅ URL को पूरी तरह से एनकोड करके सुरक्षित पाथ बनाना
            const tgUrl = `https://telegram.org{token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}&parse_mode=Markdown`;

            // ✅ GET रिक्वेस्ट के माध्यम से सीधा और सुरक्षित पिंग
            const tgResponse = await fetch(tgUrl, { method: 'GET' });
            const tgResult = await tgResponse.json();

            // Vercel लॉग्स में आउटपुट देखने के लिए
            console.log("Telegram API Response:", tgResult);

            return res.status(200).json({ status: "success", telegram: tgResult.ok });
        } catch (err) {
            console.error("Vercel Fetch System Error:", err.message);
            return res.status(500).json({ status: "error", message: err.message });
        }
    }
    
    return res.status(405).json({ error: "Method not allowed" });
}
