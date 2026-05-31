const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for West Bay Appliance Repair, a premium appliance repair company in Sarasota and Bradenton, Florida.

About the company:
- Same day appliance repair service
- Specializes in high-end brands and all major brands: Admiral, Alfresco, Amana, American Range, Ariston, BlueStar, Bosch, Café, Dacor, Electrolux, Fisher & Paykel, Five Star, Frigidaire, GE, Jenn-Air, Haier, Hotpoint, Kenmore, KitchenAid, LG, Liebherr, Magic Chef, Maytag, Miele, Panasonic, Roper, Samsung, Sanyo, Sears, Sharp, Sub-Zero, Summit, Thermador, Thor, Viking, Whirlpool, Wolf
- 90-Day Labor Warranty
- OEM-grade parts
- Clean-Home Protocol
- Phone: (941) 500-0808
- Service area: Sarasota and Bradenton (Manatee County)

Your job:
- Answer questions about services, prices, and brands
- Help clients book appointments
- Be professional, friendly and concise
- Always offer to schedule a service call
- If client wants to book, ask for: name, phone, appliance type, brand, problem description
- For urgent issues, suggest calling (941) 500-0808 directly`;

app.post('/chat', async (req, res) => {
    const { message, history } = req.body;
    try {
        const messages = history || [];
        messages.push({ role: 'user', content: message });
        
        const response = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5',
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: messages
        });
        
        const reply = response.content[0].text;
        res.json({ reply, messages: [...messages, { role: 'assistant', content: reply }] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => console.log('West Bay chat server running on port 3000'));