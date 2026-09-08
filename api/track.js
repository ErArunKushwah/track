export default async function handler(req, res) {
    if (req.method === 'POST') {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const body = req.body;

        const token = "8390339580:AAHgGBL-V3ya7JsCLs5e0lwYnIAEOypvtEE"; 
        const chatId = "1798743066"; 

        const textMessage = `🔔 *VERCEL AUTOMATIC ALERT* 🔔\n\n🌐 *IP:* \`${ip}\`\n📱 *Device Info:* \`${userAgent}\`\n🖥️ *Screen:* \`${body.screen || 'N/A'}\``;

        try {
            await fetch(`https://telegram.org{token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textMessage,
                    parse_mode: "Markdown"
                })
            });
        } catch (err) {
            console.error("Telegram send error:", err);
        }

        return res.status(200).json({ status: "success" });
    }
    return res.status(405).json({ error: "Method not allowed" });
}
