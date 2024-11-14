// Parametre som sendes til backend og api
export const params = {
  option1: {
    message: '',
    messageHistory: '',
    kontekst: '',
    model: 'gpt-4o',
    base64String: ''
  },
  option2: {
    question: '',
    parameters: {
      stream: false,
      max_tokens: 500,
      max_new_tokens: 1024,
      top_k: 64,
      top_p: 0.9,
      stop: ['<|im_end|>'],
      temperature: 0.2,
      do_sample: true,
      repetition_penalty: 1.0,
      return_full_text: true
    }
  },
  option3: { // Matematikkens byggesteiner
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_0I2uU1sPdSixkVp8sIuzomPC',
    new_thread: true,
    thread_id: ''
  },
  option4: { // Teoretisk matematikk 1
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_KZLKUwxeVkDn86DlhOAuTlPM',
    new_thread: true,
    thread_id: ''
  },
  option5: { // Teoretisk matematikk 2
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_LxcMbkhbmSpJsXvTSyblKVcq',
    new_thread: true,
    thread_id: ''
  },
  option6: { // Geologi
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_PjgBFDXTELeMF6vXKvhlOZrH',
    new_thread: true,
    thread_id: ''
  },
  option7: { // VTR
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_kleLVY0hLwXAgcgxoBgzwqLA',
    new_thread: true,
    thread_id: ''
  },
  option8: { // Geologi
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_g5BEAxNzyOcDMuSkgtV2gQy5',
    new_thread: true,
    thread_id: ''
  },
  option9: {
    message: '',
    messageHistory: '',
    kontekst: '',
    model: 'o1-preview',
    base64String: ''
  },
  option10: { // Skogmo - Elev
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_3oEC7ZpAbcIgYsheQdi1UQ1g',
    new_thread: true,
    thread_id: ''
  },
  option11: { // Skogmo - Lærer
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_3oEC7ZpAbcIgYsheQdi1UQ1g',
    new_thread: true,
    thread_id: ''
  },
  option12: {
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: '',
    new_thread: true,
    thread_id: ''
  }
}
