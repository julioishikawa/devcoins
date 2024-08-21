import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'
import { cloudinaryConfig } from '../../../../../cloudinary.config'

cloudinary.v2.config({
  cloud_name: cloudinaryConfig.cloud_name!,
  api_key: cloudinaryConfig.api_key!,
  api_secret: cloudinaryConfig.api_secret!,
})

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000) // Garanta que isso seja executado no momento da requisição
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp,
        upload_preset: cloudinaryConfig.upload_preset!,
        source: 'uw',
      },
      cloudinaryConfig.api_secret!
    )

    return NextResponse.json({ signature, timestamp })
  } catch (error: any) {
    console.error('Erro ao gerar assinatura do Cloudinary:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
