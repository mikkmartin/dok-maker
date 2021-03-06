import { NextApiResponse } from 'next'
import { getTemplate } from 'data/figma'
import { defaults } from 'static/invoice'

export default async (req, res: NextApiResponse) => {
  const templateID = req.query.template
  const template = await getTemplate(templateID || defaults.template)
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.json(template)
}
