// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { params } from '$lib/data/modelparams'
import { models } from "$lib/data/models"; // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

export const responseOpenAi = async (userParams) => {
  const accessToken = await getHuginToken()
  const payload = {
    userMessage: userParams.message,
    response_id: userParams.response_id,
    imageBase64: userParams.imageB64,
    dokFiles: userParams.dokFiles,
  }

  const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/responseOpenAi`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  return response
}

export const openAiAssistant = async (userParams) => {
  const payload = {
    assistant_id: params[userParams.valgtModell].assistant_id,
    new_thread: userParams.newThread,
    thread_id: userParams.threadId,
    messageHistory: userParams.messageHistory,
    vectorStore_id: ''
  }
  const accessToken = await getHuginToken()
  console.log('openAiAssistant', payload)
  const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/assistantOpenAi`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}

export const docQueryOpenAi = async (filliste, up) => {
  // Template API-call
  const payload = {
    assistant_id: import.meta.env.VITE_ASSISTANT_DOCQUERY,
    new_thread: up.newThread,
    vectorStore_id: up.vectorStoreId,
    thread_id: up.threadId,
    filer: filliste
  }

  const datapakken = new FormData()
  datapakken.append('assistant_id', payload.assistant_id)
  datapakken.append('thread_id', payload.thread_id)
  datapakken.append('new_thread', payload.new_thread)
  datapakken.append('vectorStore_id', payload.vectorStore_id)
  datapakken.append('message', up.message)
  datapakken.append('filer', filliste[0])

  const accessToken = await getHuginToken()

  const r = await axios.post(`${import.meta.env.VITE_AI_API_URI}/docQueryOpenAiV2`, datapakken, {
    method: 'post',
    data: datapakken,
    headers: {
      'Content-Type': 'multipart/form-data',
      authorization: `Bearer ${accessToken}`
    }
  })
  payload.assistant_id = r.data.assistant_id
  payload.thread_id = r.data.thread_id
  payload.vectorStore_id = r.data.vectorStore_id
  payload.new_thread = 'false'
  return JSON.stringify(r)
}
