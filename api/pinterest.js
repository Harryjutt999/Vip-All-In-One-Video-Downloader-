// api/pinterest.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    // 🔹 Dummy response (replace later with real API)
    return res.status(200).json({
      links: [
        {
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          type: "HD",
        },
        {
          url: "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
          type: "SD",
        },
        {
          url: "https://sample-videos.com/img/Sample-jpg-image-1mb.jpg",
          type: "image",
        },
      ],
    });
  } catch (err) {
    console.error("pinterest err", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch pinterest", details: err.message });
  }
}
