import type { Metadata } from 'next'
import { ALL_MODELS } from '../modelData'
import SmartToiletModelClient from './SmartToiletModelClient'
import BidetLidsClient from './BidetLidsClient'

const BASE = 'https://neweraexclusive.ae'

export async function generateStaticParams() {
  const locales = ['en', 'ru', 'ar']
  return locales.flatMap(locale =>
    ALL_MODELS.map(model => ({ locale, modelId: model.id }))
  )
}

export function generateMetadata({
  params: { locale, modelId },
}: {
  params: { locale: string; modelId: string }
}): Metadata {
  const url = `${BASE}/${locale}/catalog/smart-toilet/${modelId}/`
  return { alternates: { canonical: url } }
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
