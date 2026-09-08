export default async function handler(req, res) {
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

            // ✅ टेलीग्राम का आधिकारिक IP (149.154.167.220) उपयोग करें ताकि ENOTFOUND एरर कभी न आए
            // होस्ट हेडर (Host Header) जोड़ना ज़रूरी है ताकि टेलीग्राम का सर्वर इसे स्वीकार करे
            const tgUrl = `https://149.154.167{token}/sendMessage`;

            const tgResponse = await fetch(tgUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Host': 'api.telegram.org' // टेलीग्राम सर्वर प्रमाणीकरण के लिए आवश्यक
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textMessage,
                    parse_mode: "Markdown"
                })
            });

            const tgResult = await tgResponse.json();
            console.log("Telegram Direct IP Response:", tgResult);

            return res.status(200).json({ status: "success", telegram: tgResult.ok });
        } catch (err) {
            console.error("Vercel Bypass System Error:", err.message);
            return res.status(500).json({ status: "error", message: err.message });
        }
    }
    
    return res.status(405).json({ error: "Method not allowed" });
}
