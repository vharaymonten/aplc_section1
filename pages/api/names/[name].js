
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { useRouter } from "next/router"

export default function handler(req, res) {
  const {name} = req.query;
  res.status(200).json({ name: name })
}
