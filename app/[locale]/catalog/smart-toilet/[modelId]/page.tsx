import { ALL_MODELS } from '../modelData'
import SmartToiletModelClient from './SmartToiletModelClient'

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
  return <SmartToiletModelClient modelId={params.modelId} />
}
