// Bibliotek for å håndtere API-kall til AZF-funksjoner

import axios from "axios";
import { params } from "$lib/data/modelparams";
import { env } from "$env/dynamic/public";

export const multimodalOpenAi = async (userParams) => {
  // Template API-call
  let payload = params[userParams.valgtModell];
  payload.message = userParams.message;
  payload.messageHistory = userParams.messageHistory;
  payload.kontekst = userParams.kontekst;
  payload.temperatur = userParams.temperatur;
  payload.bilde_base64String = userParams.base64String;
  console.log("Pæylød: ", payload);

  // Call AZF-funksjon with payload
  const response = await axios.post(env.PUBLIC_LOCAL_OPENAIMULTI, payload);
  console.log(response, env.PUBLIC_TEST); // Tester env-handling
  return response.data.choices[0].message.content;
};

export const noraChat = async (modellInfo) => {
  // Template API-call
  let payload = params[modellInfo.valgtModell];
  payload.question = modellInfo.message;
  console.log("Pæylød: ", payload);

  const response = await axios.post(env.PUBLIC_LOCAL_NORACHAT, payload);
  console.log(response, env.PUBLIC_TEST); // Tester env-handling
  return response.data;
};

export const openAiAssistant = async (modellInfo) => {
  // Template API-call
  let payload = {
    assistant_id: params[modellInfo.valgtModell].assistant_id,
    new_thread: true,
    thread_id: "", 
    question: modellInfo.message,
  };

  $: console.log(payload);

  const response = await axios.post(env.PUBLIC_LOCAL_OPENAIASSISTANT, payload);
  $: console.log(response.data.messages[1].content[0].text.value);
  return response.data.messages[1].content[0].text.value;
};

export const docQueryOpenAi = async (filliste, up) => {
    // Template API-call
    const payload = {
      assistant_id: "",
      new_thread: true,
      thread_id: "", 
      filer: filliste,
    };

  const datapakken = new FormData();

  datapakken.append("assistant_id", payload.assistant_id);
  datapakken.append("thread_id", payload.thread_id);
  datapakken.append("new_thread", payload.new_thread);
  datapakken.append("message", up.message);
  datapakken.append("filer", filliste[0]);
  // datapakken.append("filtest", filliste[0]);

  // $: console.log("docQueryOpenAi fil: ", ...datapakken);

  const r = await axios.post(env.PUBLIC_LOCAL_DOCQUERY, datapakken, {
    method: "post",
    data: datapakken,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  payload.thread_id = r.data.thread_id;
  payload.new_thread = "false";
  console.log("Thread_id: ", r.data.thread_id);
  console.log("Responsen er: ", r.data.messages[1].content[0].text.value);
  //return r.data.messages[1].content[0].text.value;
  //console.log("Sånn:", JSON.stringify(r));
  return JSON.stringify(r);
};
