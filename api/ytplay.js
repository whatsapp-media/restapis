import yts from "yt-search"
import axios from "axios"

async function ytPlay(query) {
  try {
    if (!query) throw new Error("Query tidak boleh kosong")

    // 🔎 Search video
    const search = await yts(query)
    if (!search.videos.length) {
      throw new Error("Video tidak ditemukan")
    }

    const video = search.videos[0]
    const videoUrl = video.url

    // ⬇️ Request ke API downloader
    const apiUrl =
      `https://kyzoyamada-api-rsh.vercel.app/api/ytdl?url=${encodeURIComponent(videoUrl)}&format=mp3`

    const { data } = await axios.get(apiUrl)

    if (!data.status) {
      throw new Error("Gagal mengambil audio dari API")
    }

    return {
      status: true,
      title: data.title,
      duration: data.duration,
      thumb: data.thumb,
      download: data.download,
      source: videoUrl
    }

  } catch (err) {
    return {
      status: false,
      error: err.message
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      message: "GET only"
    })
  }

  const { query } = req.query

  const result = await ytPlay(query)

  if (!result.status) {
    return res.status(400).json(result)
  }

  res.status(200).json(result)
}