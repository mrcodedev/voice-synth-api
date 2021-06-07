let voices = [];
let voicesDropDown = document.querySelector('[name="voice"]');
let statusSpeechSynth = { paused: false, speaking: false };
const TALK_TEXT = "Talk!";
const PAUSE_TEXT = "Pause";
const RESUME_TEXT = "Resume";

const utterance = new SpeechSynthesisUtterance();
const range = document.querySelector('[name="rate"]');
const pitch = document.querySelector('[name="pitch"]');
const volume = document.querySelector('[name="volume"]');
const text = document.querySelector('[name="text"]');
const speakButton = document.querySelector("#speak");
const stopButton = document.querySelector("#stop");

const languageDictionary = (language) => {
  debugger;

  const languages = {
    "de-DE": "Alemán",
    "en-US": "Inglés (Estados Unidos)",
    "en-GB": "Inglés (Gran Bretaña)",
    "es-US": "Español (Estados Unidos)",
    "es-ES": "Español (España)",
    "fr-FR": "Francés",
    "hi-IN": "Hindi",
    "id-ID": "Indonesio",
    "it-IT": "Italiano",
    "ja-JP": "Japonés",
    "ko-KR": "Koreano",
    "nl-NL": "Holandés",
    "pl-PL": "Polaco",
    "pt-BR": "Portugués (Brasil)",
    "ru-RU": "Ruso",
    "zh-CN": "Chino (Singapur)",
    "zh-HK": "Chino (Hong Kong)",
    "zh-TW": "Chino (Taiwan)",
    "sv-SE": "Sueco (Suecia)",
    "fr-CA": "Francés (Canadá)",
    "he-IL": "Hebreo (País ficticio llamado Israel)",
    "es-AR": "Español (Argentina)",
    "nl-BE": "Francés (Bélgica)",
    en: "Inglés",
    "ro-RO": "Rumano (Rumanía)",
    "pt-PT": "Portugués (Portugal)",
    "es-MX": "Español (México)",
    "th-TH": "Tailandés (Tailandia)",
    "en-AU": "Inglés (Australia)",
    "sk-SK": "Eslovaco (Eslovaquia)",
    "ar-SA": "Árabe (Arabia Saudita)",
    "hu-HU": "Húngaro (Hungría)",
    "el-GR": "Griego (Grecia)",
    "en-IE": "Inglés (Irlanda)",
    "nb-NO": "Noruego (Noruega)",
    "en-IN": "Inglés (India)",
    "da-DK": "Danés (Dinamarca)",
    "fi-FI": "Finés (Finlandia)",
    "en-ZA": "Inglés (Sudáfrica)",
    "tr-TR": "Turco (Turquía)",
    "cs-CZ": "Checo (República Checa)",
  };

  return languages[language] || language;
};

const setText = () => {
  utterance.text = text.value;
};

const getVoices = () => {
  voices = speechSynthesis.getVoices();
};

const setListVoices = () => {
  voicesDropDown.innerHTML = voices.map(
    ({ name, lang }, index) =>
      `<option value="${name}"}>${name} - ${languageDictionary(lang)}</option>`
  );
};

// VOICE ACTIONS
const speak = () => {
  const { paused, speaking } = statusSpeechSynth;

  if (!paused && !speaking) {
    speakCancel();
  }

  if (paused) {
    speakResume();
    statusSpeechSynth = { ...statusSpeechSynth, paused: false, speaking: true };
    speakButton.innerHTML = PAUSE_TEXT;
    return;
  }

  if (speaking) {
    speakPause();
    statusSpeechSynth = { ...statusSpeechSynth, paused: true, speaking: false };
    speakButton.innerHTML = RESUME_TEXT;
    return;
  }

  speechSynthesis.speak(utterance);
  statusSpeechSynth = { ...statusSpeechSynth, speaking: true };
  speakButton.innerHTML = PAUSE_TEXT;
};

const speakResume = () => {
  speechSynthesis.resume();
};

const speakPause = () => {
  speechSynthesis.pause();
  const event = new Event("custompause", { bubbles: false });
  speechSynthesis.dispatchEvent(event);
};

const speakCancel = () => {
  speechSynthesis.cancel();
  speakButton.innerHTML = TALK_TEXT;
  statusSpeechSynth = {
    ...statusSpeechSynth,
    speaking: false,
    speaking: false,
  };
};

const speakError = () => {
  statusSpeechSynth = {
    ...statusSpeechSynth,
    speaking: false,
    speaking: false,
  };
  speakButton.innerHTML = TALK_TEXT;
};

//SET VOICE PARAMETERS
const setVoice = () => {
  utterance.voice = voices.find(({ name }) => name === voicesDropDown.value);
  speakCancel();
};

const setRange = (name, value) => {
  const { speaking, paused } = statusSpeechSynth;

  if (!speaking && !paused) {
    return;
  }

  speakCancel();
  statusSpeechSynth = { ...statusSpeechSynth, speaking: false, paused: false };

  utterance[name] = value;
  speak();
};

const endVoice = () => {
  statusSpeechSynth = { ...statusSpeechSynth, speaking: false, paused: false };
  speakButton.innerHTML = TALK_TEXT;
};

const pauseStatusButton = () => {
  statusSpeechSynth = { ...statusSpeechSynth, paused: true };
  speakButton.innerHTML = RESUME_TEXT;
};

const init = () => {
  getVoices();
  setListVoices();
  setVoice();
  setText();
};

speechSynthesis.addEventListener("voiceschanged", () => init());
voicesDropDown.addEventListener("change", () => setVoice());
range.addEventListener("change", () => setRange(range.name, range.value));
pitch.addEventListener("change", () => setRange(pitch.name, pitch.value));
volume.addEventListener("change", () => setRange(volume.name, volume.value));
text.addEventListener("input", () => setText());

speakButton.addEventListener("click", () => speak());
stopButton.addEventListener("click", () => speakCancel());

speechSynthesis.addEventListener("custompause", (event) => pauseStatusButton());
utterance.addEventListener("end", () => endVoice());
utterance.addEventListener("error", () => speakError());
