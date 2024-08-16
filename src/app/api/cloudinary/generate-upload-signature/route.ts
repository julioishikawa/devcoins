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
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp,
        upload_preset: cloudinaryConfig.upload_preset!,
        source: 'uw', // Inclua todos os parâmetros necessários
      },
      cloudinaryConfig.api_secret!
    )

    return NextResponse.json({ signature, timestamp })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
