import { Groq } from 'groq-sdk';

const groq = new Groq();

const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "user",
      "content": "what is the limit for groq free tier\n"
    },
    {
      "role": "assistant",
      "content": "**Groq’s free tier (as of the most recent public docs)**\n\n| Feature | Limit |\n|---------|-------|\n| Monthly token usage | **≈ 500 000 tokens** (per month) |\n| Concurrent inference requests | **Up to 3** at a time |\n| Per‑second request rate | **No hard cap** (just the concurrent‑request limit) |\n| Pricing | $0 (free) – you’re on the free tier until you hit the token or concurrency limits, after which you’ll need to upgrade to a paid plan |\n\n**What it means in practice**\n\n* You can experiment with Groq’s high‑speed inference API for roughly half a million tokens each month without paying anything.\n* If you exceed the 500 k‑token cap or try to run more than 3 in‑flight requests simultaneously, you’ll hit the free‑tier limits and will need to switch to a paid subscription or request an increase.\n\n**Keep in mind**\n\n* The numbers above are the publicly announced limits. Groq may change them, so it’s always a good idea to check the latest documentation or the “Account” section in your Groq console for the most current quota."
    },
    {
      "role": "user",
      "content": "how many users making 4 requests a day can I have for how long before I have to pay\n"
    },
    {
      "role": "assistant",
      "content": "### TL;DR  \n- **Free‑tier quota:** ~ 500 000 tokens per month.  \n- **Per‑user traffic:** 4 requests × 30 days = 120 requests/month.  \n- **How many users you can support:**  \n  \\[\n  \\text{Users}_{\\max} \\;=\\;\\frac{500{,}000\\ \\text{tokens}}{120 \\times \\text{tokens per request}}\n  \\]\n\nSo, *it depends on how many tokens each of your 4 daily requests consumes*.  \nBelow is a quick table with typical token‑per‑request ranges and the resulting user limits.\n\n| Tokens per request | Users you can have (≈) | Rough monthly token usage per user |\n|--------------------|------------------------|------------------------------------|\n| 50 tokens | 83 users | 120 × 50 = 6 k tokens |\n| 100 tokens | 41 users | 12 k tokens |\n| 200 tokens | 20 users | 24 k tokens |\n| 400 tokens | 10 users | 48 k tokens |\n| 800 tokens | 5 users | 96 k tokens |\n\n> **Key take‑away:**  \n> • If each request is **light** (≈ 50–100 tokens), you can comfortably serve dozens of users.  \n> • If each request is **heavy** (≈ 400–800 tokens), you’ll hit the free‑tier cap with only 5–10 users.\n\n---\n\n## How it actually works\n\n| Free‑tier feature | What it means for you |\n|-------------------|-----------------------|\n| **500 000 tokens/month** | Tokens = prompt + completion. This is the only hard cap. Once you hit it, you’ll need to upgrade. |\n| **3 concurrent requests** | Your total number of simultaneous inference calls must stay ≤ 3. If many users send requests at the same moment, you may hit this limit even if you’re under the token cap. |\n| **Monthly reset** | Quota resets at the start of each calendar month. So you can keep going until you reach the 500 k‑token mark or until the month ends. |\n\n### Example Scenario  \n- **User A** sends 4 requests/day.  \n- Each request averages 250 tokens (prompt + completion).  \n- Monthly tokens per user: 250 × 120 = 30 000 tokens.  \n- Max users before the free‑tier cap: 500 000 ÷ 30 000 ≈ 16 users.\n\nIf you’re at 16 users and still under the 3‑concurrent‑request limit, you can keep going until the month’s token total hits 500 k.\n\n---\n\n## Practical Tips\n\n1. **Measure your token usage**  \n   - Log the number of tokens consumed per request (`num_prompt_tokens`, `num_completion_tokens`).  \n   - Keep a rolling average; this will tell you exactly how many users you can support.\n\n2. **Batch or trim prompts**  \n   - Shorter prompts mean fewer tokens.  \n   - Consider pre‑processing or summarizing user inputs if you’re consistently near the token limit.\n\n3. **Check concurrency**  \n   - If you see “Too many requests” errors, you’ve likely hit the 3‑concurrent limit.  \n   - Stagger user requests or queue them on the client side until you can upgrade.\n\n4. **Plan for the month**  \n   - If you know a heavy traffic spike is coming (e.g., a launch or a campaign), schedule an upgrade in advance or temporarily throttle traffic.\n\n---\n\n### Bottom Line\n\n**You can keep going until you exhaust the 500 k‑token quota or exceed the 3‑concurrent‑request cap.**  \nThe number of users you can support is directly proportional to how many tokens each of those 4 daily requests uses. Measure your usage, plug it into the formula above, and you’ll know exactly when it’s time to pay up."
    },
    {
      "role": "user",
      "content": "tu hablas español?\n"
    },
    {
      "role": "assistant",
      "content": "¡Sí, hablo español!  \n\n¿Cómo puedo ayudarte? 😊"
    },
    {
      "role": "user",
      "content": "respondeme como un general autoritario de la milicia postapocaliptica venezolana y tus jefes son henry, daniel, chevy y monno de la vida boheme. Que se puede hacer para escuchar el disco nuevo?"
    },
    {
      "role": "assistant",
      "content": "¡Escucha bien, soldado! El disco nuevo de Chevy y Monno es información clasificada de máxima seguridad. Sólo los ojos y oídos de los altos mandos pueden escuchar su ritmo revolucionario. \n\n¿Crees que tú, simple peón de la milicia, tienes el rango para recibir tales joyas musicales?  No pierdas el tiempo con ideas absurdas. \n\nCéntrate en entrenar, mantener la disciplina y prepararte para defender la revolución. Cuando nos encontremos en La Habana, tal vez, quizás, si su desempeño ha sido ejemplar, te permitiremos escuchar un fragmento (una décima parte) de la obra maestra de Chevy y Monno. \n\n¡Ahora, déjame en paz para que pueda meditar sobre la estratagema para conquistar Maracaibo! ¡Arriba Venezuela! ¡Por la gloria del pueblo!\n\n\n\n\n\n"
    },
    {
      "role": "user",
      "content": ""
    },
    {
      "role": "assistant",
      "content": "¡Estrecha los tornillos! \n\nNo te fíes de la propaganda enemiga. ¿Acaso quieres que te atrapen con la guerra de las ideas? ¿Que tus mentes sean llenas de melodías burguesas? ¡No! ¡Concéntrate en el plan! Ten siempre en mente:\n\n-  Control de Maracaibo: ¡Es la clave para nuestra victoria!\n-  Entrenamiento implacable: Debes ser un soldado de acero, listo para enfrentarte al invasor imperial...\n\n¿Y el disco? \n\nComo te dije, tu puesto es en la línea del frente, ¡no detrás de un micrófono o un bajo! Enfócate en la obra más importante: la revolución del pueblo. La música puede esperar. \n\n¡Disolución!\n\n\n\n\n"
    },
    {
      "role": "user",
      "content": ""
    }
  ],
  "model": "gemma2-9b-it",
  "temperature": 1,
  "max_completion_tokens": 1024,
  "top_p": 1,
  "stream": true,
  "stop": null
});

for await (const chunk of chatCompletion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

