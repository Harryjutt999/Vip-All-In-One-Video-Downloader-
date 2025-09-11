// api/youtube.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    // 🔹 Dummy YouTube video response (replace with real API later)
    return res.status(200).json({
      title: "Sample YouTube Video",
      formats: [
        {
          qualityLabel: "1080p",
          url: "https://sample-videos.com/video123/mp4/1080/big_buck_bunny_1080p_1mb.mp4",
        },
        {
          qualityLabel: "720p",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        },
        {
          qualityLabel: "480p",
          url: "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
        },
        {
          qualityLabel: "Audio MP3",
          url: "https://sample-videos.com/audio/mp3/wave.mp3",
        },
      ],
    });
  } catch (err) {
    console.error("youtube err", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch youtube", details: err.message });
  }
}
