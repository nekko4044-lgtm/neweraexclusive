import { ALL_MODELS } from '../modelData'
import SmartToiletModelClient from './SmartToiletModelClient'
import BidetLidsClient from './BidetLidsClient'

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'ar']
  return locales.flatMap(locale =>
    ALL_MODELS.map(model => ({ locale, modelId: model.id }))
  )
}

export default function SmartToiletModelPage({
  params,
}: {
  params: { locale: string; modelId: string }
}) {
  if (params.modelId === 'bidet-lids') {
    return <BidetLidsClient />
  }
  return <SmartToiletModelClient modelId={params.modelId} />
}
