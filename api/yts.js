import yts from "yt-search";

async function ytSearch(query) {
  if (!query) {
    return { status: false, message: "Query tidak boleh kosong" };
  }

  try {
    const result = await yts(query);

    const videos = result.videos.slice(0, 10).map((v) => ({
      title: v.title,
      url: v.url,
      timestamp: v.timestamp,
      duration: v.seconds,
      views: v.views,
      ago: v.ago,
      author: v.author.name,
      thumbnail: v.thumbnail
    }));

    return {
      status: true,
      total: result.videos.length,
      videos
    };
  } catch (err) {
    return {
      status: false,
      message: err.message
    };
  }
}

// ==== API HANDLER ====
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      message: "GET only"
    });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Parameter 'query' wajib diisi"
    });
  }

  const result = await ytSearch(query);

  if (!result.status) {
    return res.status(500).json(result);
  }

  res.status(200).json(result);
}