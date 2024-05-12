export const params = {
  "option1": {
    "message": "Hvorfor er himmelen blå?",
    "kontekst": "Du er en hyggelig assistent som skal svare så godt du kan på spørsmål fra brukeren. Svar alltid på norsk.",
    "model": "gpt-3.5-turbo"
  },
  "option2": {
    "message": "Hvorfor er havet blått?",
    "kontekst": "Du er en hyggelig assistent som skal svare så godt du kan på spørsmål fra brukeren. Svar alltid på norsk.",
    "model": "gpt-4-turbo"
  },
  "option3": {
    "question": "Hva kalles en tradisjonell norsk festdrakt?",
    "parameters": {
      "stream": false,
      "max_tokens": 500,
      "max_new_tokens": 1024,
      "top_k": 64,
      "top_p": 0.9,
      "stop": ["<|im_end|>"],
      "temperature": 0.2,
      "do_sample": true,
      "repetition_penalty": 1.0,
      "return_full_text": true
      }
  },
  "option4": {
    "message": "Skriv en setning om Oslo?",
    "kontekst": "Du er en hyggelig assistent som skal svare så godt du kan på spørsmål fra brukeren. Svar alltid på norsk.",
    "model": "gpt-3.5-turbo",
    "assistant_id": "asst_BJazzPrqisexDOnT6GfE76jY",
    "new_thread": true,
    "thread_id": "thread_a2YfpinOlgziNSj7K6tmGBbj"
  },
  "option5": {
    "model": "gpt-4-turbo",
    "question": "Beskriv hvordan denne oppgaven kan løses",
    "bilde_url": "https://www.matematikksenteret.no/sites/default/files/images/Blogg/Oppgave%20elva.jpg"
  }
}
