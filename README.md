# Hugin - KI-tjeneste for Telemark fylkeskommune

<div align="center">
  <img src="src/lib/images/TFK_logo.png" alt="Telemark fylkeskommune logo" width="200">
</div>

Hugin er en KI-tjeneste utviklet av og for Telemark og Vestfold fylkeskommune. Tjenesten tilbyr tilgang til ulike språkmodeller og KI-verktøy gjennom webapplikasjon. Deler av tjenesten er under aktiv utvikling så feil kan forekomme. Søstertjenesten Munin lever på [GitHub-sidene til Vestfold fylkeskommune](https://github.com/vestfoldfylke/munin-svelte-web).

## 📋 Innholdsfortegnelse

- [Om prosjektet](#om-prosjektet)
- [Funksjoner](#funksjoner)
- [Teknisk arkitektur](#teknisk-arkitektur)
- [Installasjon og oppsett](#installasjon-og-oppsett)
- [Utvikling](#utvikling)
- [Prosjektstruktur](#prosjektstruktur)
- [API og tjenester](#api-og-tjenester)
- [Sikkerhet og autentisering](#sikkerhet-og-autentisering)
- [Bidra til prosjektet](#bidra-til-prosjektet)
- [Lisens](#lisens)

## 🚀 Om prosjektet

Hugin er en webbasert frontend-applikasjon bygget med SvelteKit som fungerer som et grensesnitt til ulike KI-tjenester. Prosjektet er designet for å gi ansatte i Telemark og Vestfold fylkeskommune enkel tilgang til kraftige KI-verktøy.

### Hovedmål
- Demokratisere tilgang til KI-teknologi innad i organisasjonen og for elever i videregående skole
- Gi ansatte mulighet til å bruke KI i sitt daglige arbeid
- Tilby en sikker og kontrollert miljø for KI-eksperimentering
- Uforske bruksområder for både norske og internasjonale språkmodeller

## ✨ Funksjoner

### 🗣️ Chat
Hovedfunksjonen i Hugin som tilbyr:
- **Flerspråklige modeller**: Tilgang til GPT-4.1, Mistral Large, NoraLLM og flere
- **Multimodal støtte**: Bildeopplasting og -analyse
- **Kontekstuelle samtaler**: Justerbar temperatur og kontekst for noen av modellene
- **Dokumentanalyse**: Mulighet for å laste opp og analysere dokumenter
- **Assistenter**: Spesialiserte AI-assistenter for ulike bruksområder innen utdanning og organisasjon

### 📄 Dokumentsøk
- Last opp dokumenter i ulike formater
- Chat direkte med dokumentinnhold
- Få svar basert på dokumentets innhold
- Støtte for PDF, Word og tekstfiler

### 🎤 Transkripsjon
- **Lydopplasting**: Last opp lydfiler for transkripsjon
- **Direkte opptak**: Ta opp lyd direkte i nettleseren
- **Norsk talegjenkjenning**: Basert på Nasjonalbibliotekets KI-modell optimalisert for norsk språk

### 🧪 Labs
Eksperimentelt område for:
- Testing av nye funksjoner
- Strukturerte responser med Zod-skjemaer
- Utviklingsfunksjoner under testing
- Beta-versjoner av kommende funksjoner

### 🤖 Spesialiserte botter
- **Orgbotter**: Organisasjonsspesifikke assistenter
- **Skolebotter**: Utdanningsrettede KI-verktøy

## 🏗️ Teknisk arkitektur

### Frontend
- **Framework**: SvelteKit 5
- **Språk**: JavaScript/
- **Hosting**: Vercel

### Integrasjoner
- **OpenAI API**: GPT-modeller
- **Mistral AI**: Multimodale modeller
- **Azure Functions**: Backend-tjenester
- **Hugging Face**: Åpne språkmodeller
- **Microsoft Authentication Library**: Sikker pålogging

## 🛠️ Installasjon og oppsett

### Forutsetninger
- Node.js (versjon 22 eller nyere)
- npm
- Git

### Steg-for-steg installasjon

1. **Klon repositoriet**
   ```bash
   git clone https://github.com/TFK/hugin-svelte-web.git
   cd hugin-svelte-web
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   ```

3. **Konfigurer miljøvariabler**
   ```bash
   cp env_example .env
   ```
   
   Rediger `.env`-filen og legg til nødvendige API-nøkler og konfigurasjoner:
   ```env
   VITE_AI_API_URI=din_backend_url
   VITE_CLIENT_ID=din_azure_client_id
   VITE_TENANT_ID=din_azure_tenant_id
   .... osv
   ```

4. **Start utviklingsserveren**
   ```bash
   npm run dev
   ```

5. **Åpne applikasjonen**
   Gå til `http://localhost:5173` i nettleseren din og ha det gøy! 

### Produksjonsbygg
```bash
npm run build
npm run preview
```

## 💻 Utvikling

### Tilgjengelige kommandoer
```bash
npm run dev          # Start utviklingsserver
```

### Utviklingsmiljø
Prosjektet bruker:
- **Vite** som byggesystem

## 📁 Prosjektstruktur

```
hugin-svelte-web/
├── src/
│   ├── lib/
│   │   ├── components/          # Gjenbrukbare Svelte-komponenter
│   │   ├── services/            # API-tjenester og integrasjoner
│   │   ├── data/                # Datamodeller og konfigurasjoner
│   │   ├── helpers/             # Hjelpefunksjoner
│   │   ├── auth/                # Autentiseringslogikk
│   │   └── images/              # Statiske bilder
│   ├── routes/                  # SvelteKit-ruter og sider
│   ├── app.html                 # HTML-mal
│   └── app.css                  # Globale stiler
├── static/                      # Statiske filer
├── package.json                 # Prosjektavhengigheter
├── svelte.config.js            # Svelte-konfigurasjon
├── vite.config.js              # Vite-konfigurasjon
└── README.md                   # Denne filen
```

### Nøkkelkomponenter

#### `/src/lib/components/`
- `ChatBlobs.svelte` - Chatmeldingsvisning
- `CardButton.svelte` - Hovednavigasjonskort
- `Modal.svelte` - Modalvindu-komponent
- `ModelInfo.svelte` - Modellinformasjon
- `IconSpinner.svelte` - Lasteindikatorer

#### `/src/lib/services/`
- `openAiTools.js` - OpenAI API-integrasjon
- `mistralTools.js` - Mistral AI-integrasjon
- `huggingFaceTools.js` - Hugging Face-tjenester
- `openaiToolsLabs.js` - Eksperimentelle OpenAI-funksjoner

#### `/src/lib/data/`
- `models.js` - Konfigurasjon av tilgjengelige KI-modeller

## 🔧 API og tjenester

### Hovedtjenester

#### OpenAI-integrasjon
```javascript
import { responseOpenAI } from '$lib/services/openAiTools.js';

const response = await responseOpenAI({
  message: 'Din melding',
  kontekst: 'Kontekst for samtalen',
  temperatur: 0.7,
  model: 'gpt-4o'
});
```

#### Mistral AI-integrasjon
```javascript
import { multimodalMistral } from '$lib/services/mistralTools.js';

const response = await multimodalMistral({
  message: 'Beskriv dette bildet',
  base64String: imageBase64,
  model: 'pixtral-large-latest'
});
```

#### Strukturerte responser
```javascript
import { testStructured } from '$lib/services/openaiToolsLabs.js';

const response = await testStructured({
  message: 'Generer superheltinfo',
  messageHistory: [],
  kontekst: 'Superhelt-kontekst'
});
```

### Backend-kommunikasjon
Alle API-kall går gjennom Azure Functions som fungerer som mellomlag:
- Autentisering og autorisasjon
- Rate limiting
- Logging og overvåking
- API-nøkkelhåndtering

## 🔐 Sikkerhet og autentisering

### Microsoft Authentication Library (MSAL)
Prosjektet bruker MSAL for sikker pålogging:

```javascript
import { msalAuth } from '$lib/auth/msal-auth.js';

// Logg inn
await msalAuth.loginPopup();

// Hent tilgangstoken
const token = await msalAuth.acquireTokenSilent();
```

### Rollebasert tilgang
```javascript
import { checkRoles } from '$lib/helpers/checkRoles.js';

const hasAccess = checkRoles(userRoles, requiredRoles);
```

### Sikkerhetstiltak
- OAuth 2.0 / OpenID Connect autentisering
- JWT-token validering
- Rollebasert tilgangskontroll

## 🤝 Bidra til prosjektet

Vi ønsker bidrag fra utviklere! Følg disse retningslinjene:

### Arbeidsflyt
1. **Fork repositoriet** og klon din fork
2. **Opprett en ny branch** for din funksjon:
   ```bash
   git checkout -b feature/din-nye-funksjon
   ```
3. **Gjør endringene dine** og test grundig
4. **Commit endringene** med beskrivende meldinger:
   ```bash
   git commit -m "Legg til: ny chat-funksjonalitet"
   ```
5. **Push til din branch**:
   ```bash
   git push origin feature/din-nye-funksjon
   ```
6. **Opprett en Pull Request** med detaljert beskrivelse

### Kodestandard
- Følg eksisterende kodestil
- Skriv kommentarer på norsk
- Test alle nye funksjoner
- Oppdater dokumentasjon ved behov

### Typer bidrag vi ønsker
- 🐛 Feilrettinger
- ✨ Nye funksjoner
- 📝 Dokumentasjonsforbedringer
- 🎨 UI/UX-forbedringer
- ⚡ Tips og andre gode innspill

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen. Se [LICENSE](LICENSE) filen for detaljer.

---

## 📞 Kontakt og støtte

For spørsmål eller støtte, kontakt utviklingsteamet i Telemark og/eller Vestfold fylkeskommune.

**Utviklet med ❤️ av Telemark og Vestfold fylkeskommune**
