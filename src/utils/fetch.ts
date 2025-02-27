// const audioContext = new (window?.AudioContext || window?.webkitAudioContext)()
import axios from 'axios'

export async function fetchAudioBuffer(url: string, audioContext: any) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return audioContext.decodeAudioData(response.data)
}
