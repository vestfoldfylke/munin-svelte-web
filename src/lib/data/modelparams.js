
// Parametre som sendes til backend og api
export const params = {
  "option1": {
    "message": "",
    "messageHistory": "",
    "kontekst": "",
    "model": "gpt-4o",
    "base64String": "",
  },
  "option2": {
    "question": "",
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
      "return_full_text": true,
      }
  },
  "option3": {
    "message": "",
    "kontekst": "",
    "model": "gpt-4o",
    "assistant_id": "asst_masx2DR1ynqNvP308OWlKzix",
    "new_thread": true,
    "thread_id": "",
  },
  "option4": {
    "message": "",
    "kontekst": "",
    "model": "gpt-4o",
    "assistant_id": "asst_PjgBFDXTELeMF6vXKvhlOZrH",
    "new_thread": true,
    "thread_id": "",
  }
}
