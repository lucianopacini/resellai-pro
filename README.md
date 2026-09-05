# 🦁 ResellAI Pro

> Il tuo assistente AI per il reselling di abbigliamento usato.


## 📖 Descrizione

ResellAI Pro è un'applicazione Full Stack progettata per aiutare gli utenti nella vendita di capi di abbigliamento usati attraverso il supporto dell'intelligenza artificiale.

L'utente può inserire le informazioni del prodotto, caricare un'immagine e ottenere un'analisi AI completa. L'analisi utilizza sia i dati testuali del prodotto (brand, categoria, condizione e taglia) sia l'immagine caricata per generare prezzo suggerito, fascia di prezzo, descrizione ottimizzata, punti di forza, cliente ideale e analisi visiva.

Il progetto è stato sviluppato con React, Node.js, Express, Supabase e OpenAI API per offrire un'esperienza semplice, moderna e intuitiva.


## ✨ Funzionalità

- 🤖 Analisi AI dei capi di abbigliamento usati.
- 💰 Generazione di un prezzo suggerito e di una fascia di prezzo.
- 📝 Creazione automatica di una descrizione ottimizzata per la vendita.
- 🎯 Individuazione del cliente ideale.
- ⭐ Evidenziazione dei principali punti di forza del prodotto.
- 📷 Caricamento e gestione delle immagini.
- 👀 Analisi visiva AI delle immagini dei prodotti.
- 🔐 Autenticazione utente.
- 📂 Storico delle valutazioni salvate.
- 🔍 Ricerca e filtro dei prodotti.
- 📱 Interfaccia moderna e responsive.


## 🛠️ Tecnologie utilizzate

### Frontend
- React
- JavaScript (ES6+)
- Vite
- CSS3

### Backend
- Node.js
- Express.js

### Database & Storage
- Supabase
- PostgreSQL
- Supabase Storage

### Intelligenza Artificiale
- OpenAI API (GPT)

### Strumenti di sviluppo
- Git
- GitHub
- Visual Studio Code


## 🏗️ Architettura del progetto

ResellAI Pro è organizzato secondo un'architettura Full Stack, composta da un frontend sviluppato con React, un backend realizzato con Node.js ed Express, un database PostgreSQL gestito tramite Supabase e l'integrazione delle API OpenAI per l'analisi AI dei prodotti.

                         👤 UTENTE
                             │
                             ▼
                    🖥️ FRONTEND (React)
                             │
                             ▼
                 ⚙️ BACKEND (Node + Express)
                       /                 \
                      /                   \
                     ▼                     ▼
          🗄️ SUPABASE                  🤖 OPENAI API
       Database + Storage          Analisi AI + Vision
                     ▲                     │
                     │                     ▼
                     └──────────────  JSON RISULTATO
                                           │
                                           ▼
                                    🖥️ FRONTEND
                                           │
                                           ▼
                                      👤 UTENTE


## 📸 Screenshot

### Pre-login
![Pre-login](./screenshots/01-pre-login.png)

### Add product
![Add-product](./screenshots/02-add-product.png)

### Dashboard
![Dashboard](./screenshots/03-dashboard.png)

### AI analysis
![AI-analysis](./screenshots/04-ai-analysis.png)


## 🚀 Installazione

1. Clona il repository.
```bash
git clone ...
cd ...
```
2. Installa le dipendenze del frontend.
```bash
cd frontend
npm install
```
3. Configura il file .env del frontend.

4. Installa le dipendenze del backend.
```bash
cd ../backend
npm install
```
5. Configura il file .env del backend.

6. Avvia il frontend e il backend in due terminali separati.
Frontend:
```bash
npm run dev
```
Backend:
```bash
npm run dev
```

## ⚙️ Variabili d'ambiente

### Frontend
Creare un file `.env` nella cartella del frontend:
```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```
### Backend
Creare un file `.env` nella cartella del backend:
```env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## 🌐 API

ResellAI Pro utilizza le API di OpenAI per analizzare i prodotti e generare automaticamente:

- Prezzo suggerito
- Fascia di prezzo
- Titolo ottimizzato
- Descrizione ottimizzata per la vendita
- Cliente ideale
- Punti di forza
- Market score
- Analisi visiva e verifica di coerenza tra immagine e dati inseriti


### OpenAI API

Utilizzata per generare automaticamente l'analisi AI dei prodotti, inclusa l'analisi visiva delle immagini.


### Backend API

- GET    /products
- POST   /products
- PUT    /products/:id
- DELETE /products/:id
- POST /api/ai/analyze-product


## 🔮 Sviluppi futuri

- [ ] Implementare una chat AI personalizzata.
- [ ] Migliorare ulteriormente la qualità delle analisi AI.
- [ ] Aggiungere statistiche e dashboard personali.
- [ ] Consentire il caricamento di più immagini per prodotto.
- [ ] Implementare notifiche e preferiti.
- [ ] Migliorare ulteriormente l'interfaccia utente e l'esperienza d'uso.
- [ ] Migliorare continuamente il progetto attraverso nuove funzionalità e ottimizzazioni.


## 👨‍💻 Autore

**Luciano Pacini**

Sviluppatore Full Stack appassionato di React, Node.js e Intelligenza Artificiale.

Credo nell'apprendimento continuo, nella cura dei dettagli e nella realizzazione di applicazioni moderne, intuitive e utili.

Questo progetto rappresenta una tappa importante del mio percorso di crescita come sviluppatore e continuerà a evolversi nel tempo.


