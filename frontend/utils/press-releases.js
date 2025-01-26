import pressReleases from "../../backend/press_releases.json";

export default function handler(req, res) {
  res.status(200).json(pressReleases);
}
