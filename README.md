# ⚡ StrazzeCloud — Spatial Productivity OS & To-Do Suite

> **Dalla classica to-do list 2D all'esperienza tridimensionale immersiva su WebGL, fisica in tempo reale e shader GPU.**

---

## 🌌 Panoramica del Progetto

**StrazzeCloud** è un ecosistema avanzato per la gestione di liste, sotto-liste, priorità e attività quotidiane. Nato originariamente come una PWA monolitica ad alte prestazioni per dispositivi mobili (`StrazzeCloud.html`), il progetto si è evoluto in **StrazzeCloud 3D** (`strazze-3d/`): una reimmaginazione radicale basata su **React Three Fiber (Three.js)**, fisica computazionale **Rapier 3D**, animazioni cinetiche **GSAP**, shader GLSL procedurali e sound design interattivo via **Web Audio API**.

L'obiettivo fondamentale rimane immutato: **organizzare idee, pianificare progetti e spuntare compiti**. Tuttavia, l'interfaccia abbandona i limiti del DOM piatto per diventare un vero e proprio *Palazzo della Memoria Spaziale* (Metodo dei Loci).

---

## 🏛️ Architettura del Repository

```
StrazzeCloud/
│
├── README.md                     # Documentazione ufficiale del progetto
├── StrazzeCloud.html             # [Core 2D] PWA Standalone monolitica (Firebase + Offline)
├── img/                          # Brand identity e loghi ufficiali
│   └── StrazzeCloud_logo.png
│
└── strazze-3d/                   # [Core 3D] Spatial WebGL Experience (R3F + Rapier + GSAP)
    ├── package.json              # Dipendenze e script Vite
    ├── vite.config.js            # Configurazione bundler
    ├── index.html                # Entrypoint WebGL con Space Grotesk
    └── src/
        ├── main.jsx              # Bootstrapper React 18
        ├── App.jsx               # Orchestratore Canvas + HUD + Eventi tastiera
        ├── store/
        │   └── useStore.js       # Store globale Zustand (liste, task, fisica, audio)
        ├── audio/
        │   └── AudioEngine.js    # Sintetizzatore procedurale Web Audio API (zero file esterni)
        ├── shaders/
        │   ├── AtmosphereShader.js            # GLSL: cupola atmosferica volumetrica
        │   └── LusionDisplacementMaterial.js  # GLSL: distorsione e hover magnetico
        └── components/
            ├── Experience.jsx                 # R3F Canvas root con PostProcessing e Rapier
            ├── Room.jsx                       # Stanza dark, MeshReflectorMaterial e luci
            ├── SplineEnvironment.jsx          # Integrazione asset scultorei Spline
            ├── CameraController.jsx           # Navigazione Ohzi: zoom infinito e world-flip
            ├── ListBoard3D.jsx                # Monoliti spaziali e render delle liste
            ├── TaskItem3D.jsx                 # Scheda task con raycasting e deformazione
            ├── FallingTaskPhysics.jsx         # Effetto Bruno Simon: caduta e rimbalzo reale
            ├── FloorCollider.jsx              # Collider fisico del pavimento a quota y = -5
            └── HUD.jsx                        # Interfaccia heads-up display cybernetica
```

---

## 🚀 Le Due Anime di StrazzeCloud

### 1. StrazzeCloud 3D — Spatial WebGL Edition (`strazze-3d/`)

L'interfaccia 3D è progettata come una galleria sci-fi interattiva ispirata ai più grandi studi di creative development internazionali:

* 🏛️ **Ambiente & Stile (Ispirazione *Active Theory*)**:
  * Stanza minimale dark sci-fi con cupola atmosferica renderizzata da uno shader GLSL personalizzato.
  * Pavimento a specchio continuo tramite `<MeshReflectorMaterial>` con riflessione speculare, sfocatura in tempo reale e griglia ottica al neon.
  * Post-processing cinematografico con **Bloom selettivo**, **Vignettatura** e **Aberrazione Cromatica radiale**.

* 🧲 **Interazione Hover (Ispirazione *Lusion*)**:
  * Ogni task card è un oggetto 3D sensibile al raycasting del mouse.
  * Un vertex shader dedicato (`LusionDisplacementMaterial`) deforma i vertici della geometria con onde di rumore procedurale (*Simplex Noise 3D*) in prossimità del puntatore.
  * Attrazione magnetica fluida: la scheda si inclina verso il mouse e si protende verso la telecamera lungo l'asse Z.

* 🌀 **Navigazione Spaziale (Ispirazione *Ohzi*)**:
  * Nessun ricaricamento di pagina: il passaggio dalla vista panoramica (*Overview*) alla lista specifica e ai sotto-task avviene tramite una transizione di camera continua orchestrata con **GSAP**.
  * Effetto *world-flip* e zoom infinito (dolly-zoom con compressione FOV) che attraversa le geometrie dei portali, accompagnato da uno sweep sonoro iposonico.

* 💥 **Completamento Task Fisico (Ispirazione *Bruno Simon*)**:
  * Quando un task viene completato, si scollega fisicamente dal pannello fluttuante.
  * Viene convertito istantaneamente in un `<RigidBody>` dinamico del motore fisico **Rapier 3D** con gravità accelerata ($g = -18\,m/s^2$).
  * Riceve un impulso e una coppia angolare casuale, precipitando ed eseguendo rimbalzi elastici realistici sul pavimento prima di stabilizzarsi.
  * L'impatto sul terreno calcola la forza d'urto e genera un colpo percussivo sub-bass in tempo reale.
  * Un sistema di garbage collection automatico dissolve i blocchi caduti dopo 7 secondi per azzerare i memory leak.

---

### 2. StrazzeCloud 2D — Standalone PWA (`StrazzeCloud.html`)

La versione portatile e ultra-leggera in un singolo file:
* **Storage Ibrido**: Integrazione con Firebase Firestore per la sincronizzazione cloud multi-dispositivo, affiancata da un motore di cache offline in `localStorage` con accodamento delle scritture pendenti (`pendingWrites`).
* **Funzionalità Complete**: Categorie personalizzate con colori ed emoji, gestione gerarchica di sotto-task, scadenze temporali con notifiche, ricerca in tempo reale con evidenziazione del testo, esportazione calendario `.ics` e backup JSON.
* **UI Mobile-First**: Bottom sheets, gesture di scorrimento, modalità scura/chiara e layout compatto.

---

## 🛠️ Stack Tecnologico (Versione 3D)

| Ambito | Libreria / Tool | Ruolo & Funzione |
|---|---|---|
| **Core Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) | Rendering dichiarativo e build system HMR |
| **3D Rendering** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | Scena 3D WebGL dichiarativa |
| **R3F Helper Suite** | [@react-three/drei](https://github.com/pmndrs/drei) | Materiali riflettenti, MSDF text, Float helpers |
| **Motore Fisico** | [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) | Simulazione collisioni, gravità e corpi rigidi |
| **Motion & Camera** | [GSAP 3](https://greensock.com/gsap/) | Interpolazione camera, zoom infinito ed easing elastico |
| **Modellazione 3D** | [Spline](https://spline.design/) | Modelli geometrici dell'ambiente e asset scultorei |
| **Stato Globale** | [Zustand](https://github.com/pmndrs/zustand) | Store atomico per liste, task, telemetria e audio |
| **Shading & GPU** | GLSL (OpenGL Shading Language) | Atmosfera procedurale e deformazione magnetica vertici |
| **Audio Engine** | Web Audio API (Nativa) | Sintesi procedurale di whoosh, hover e impatti fisici |

---

## 💻 Guida all'Installazione ed Esecuzione

### Prerequisiti
* **Node.js**: versione `>= 18.0.0` (raccomandata v20+ o v24+)
* **NPM**: versione `>= 9.0.0`
* Un browser moderno con supporto WebGL2 e Web Audio (Chrome, Edge, Brave, Firefox, Safari)

---

### Avviare StrazzeCloud 3D

1. Apri il terminale e posizionati nella directory `strazze-3d`:
   ```bash
   cd strazze-3d
   ```

2. Installa i pacchetti necessari:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo Vite:
   ```bash
   npm run dev
   ```

4. Apri l'indirizzo mostrato nel terminale (di default `http://localhost:3000`).

---

### Avviare StrazzeCloud 2D (Standalone PWA)

La versione 2D non richiede installazione di pacchetti:
* Fai doppio click sul file [StrazzeCloud.html](file:///Users/samu/samu08/Progetti_personali/StrazzeCloud/StrazzeCloud.html) per aprirlo direttamente in qualsiasi browser.
* In alternativa, puoi servirlo tramite qualsiasi server statico locale:
  ```bash
  npx serve .
  ```

---

## 🎮 Comandi e Interazioni (Versione 3D)

* **Click su una Lista (Overview)**: Zoom cinematografico della telecamera all'interno della lista selezionata.
* **Passaggio del Mouse (Hover su Task)**: Attivazione dell'effetto elastico-magnetico e deformazione organica dei vertici della scheda 3D.
* **Click sul Checkbox del Task**: Completamento dell'attività, distacco fisico dalla lavagna, caduta gravitazionale con rimbalzi fisici e suono d'impatto procedurale.
* **Click su un Portale Sotto-Lista**: Zoom infinito e attraversamento dimensionale dentro il blocco della sotto-lista.
* **Pulsante `OVERVIEW` o tasto `ESC`**: Ritorno immediato della telecamera alla vista panoramica 3D.
* **Tasto `M` o Icona Volume nell'HUD**: Attivazione / disattivazione istantanea del paesaggio sonoro procedurale.
* **Pulsante `+ NEW DIRECTIVE`**: Apertura del creatore di compiti per inserire nuove attività con priorità e dispiegarle in 3D.

---

## 🎨 Asset e Risorse di Produzione

Per personalizzare ulteriormente o arricchire l'estetica:

1. **Modelli 3D e Spline**:
   * I modelli della stanza virtuale o dei monoliti possono essere esportati da [Spline](https://spline.design/) o modellati in Blender ed esportati in formato compresso `.glb` (Draco).
2. **Mappe HDRI**:
   * Per un'illuminazione fotorealistica dei materiali in vetro/metallo, è possibile caricare mappe d'ambiente notturne o studio da [PolyHaven](https://polyhaven.com/hdris) a risoluzione 1K/2K.
3. **Tipografia 3D & MSDF**:
   * L'applicazione impiega font geometrici e tecnici (*Space Grotesk*, *Space Mono*, *Neue Machina*) renderizzati tramite texture *Multi-channel Signed Distance Field* (MSDF) per garantire nitidezza assoluta a qualsiasi distanza e inclinazione.
4. **Sound Design**:
   * L'archivio include un motore di sintesi procedurale nativo in [src/audio/AudioEngine.js](file:///Users/samu/samu08/Progetti_personali/StrazzeCloud/strazze-3d/src/audio/AudioEngine.js) che genera autonomamente le frequenze per transizioni, hover e impatti, eliminando la necessità di scaricare file audio esterni.

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Consulta il codice per dettagli e personalizzazioni.
Creato e curato per spingere la produttività personale verso nuovi orizzonti spaziali.
