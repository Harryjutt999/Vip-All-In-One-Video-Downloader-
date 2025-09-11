// api/facebook.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    // TODO: Replace with a real API when available
    // For now, return dummy HD/SD links for testing
    return res.status(200).json({
      hd: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      sd: "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
    });
  } catch (err) {
    console.error("facebook err", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch facebook", details: err.message });
  }
}
