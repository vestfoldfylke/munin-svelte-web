export const params = {
  "option1": {
    "message": "",
    "messageHistory": "",
    "kontekst": "",
    "model": "gpt-4o",
    "base64String": ""
  },
  "option2": {
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
  "option3": {
    "message": "Skriv en setning om Oslo?",
    "kontekst": "Du er en hyggelig assistent som skal svare så godt du kan på spørsmål fra brukeren. Svar alltid på norsk.",
    "model": "gpt-3.5-turbo",
    "assistant_id": "asst_BJazzPrqisexDOnT6GfE76jY",
    "new_thread": true,
    "thread_id": "thread_a2YfpinOlgziNSj7K6tmGBbj"
  }
}
