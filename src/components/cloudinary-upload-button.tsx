'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cloudinaryConfig } from '../../cloudinary.config'

declare global {
  interface Window {
    cloudinary: any
  }
}

interface CloudinaryUploadButtonProps {
  onUploadSuccess: (result: any) => void
  signatureEndpoint: string
  uploadPreset: string
  className?: string
}

export default function CloudinaryUploadButton({
  onUploadSuccess,
  signatureEndpoint,
  uploadPreset,
}: CloudinaryUploadButtonProps) {
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const loadCloudinaryWidget = async () => {
      if (!window.cloudinary) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }

      if (!widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: cloudinaryConfig.cloud_name,
            apiKey: cloudinaryConfig.api_key,
            uploadPreset: uploadPreset,
            uploadSignature: async (
              callback: (data: any) => void,
              paramsToSign: object
            ) => {
              const response = await fetch(signatureEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paramsToSign }),
              })
              const data = await response.json()
              callback({ ...data, api_key: cloudinaryConfig.api_key })
            },
            styles: {
              palette: {
                window: '#3f3f46', // Cor da janela do modal
                windowBorder: '#3498db', // Cor da borda da janela
                tabIcon: '#ffffff', // Cor dos ícones das abas
                menuIcons: '#ffffff', // Cor dos ícones do menu
                textDark: '#ffffff', // Cor do texto escuro
                textLight: '#ecf0f1', // Cor do texto claro
                link: '#3498db', // Cor dos links
                action: '#e74c3c', // Cor das ações (botões de ação)
                inProgress: '#3498db', // Cor do indicador de progresso
                complete: '#2ecc71', // Cor do indicador de upload completo
                error: '#e74c3c', // Cor das mensagens de erro
                sourceBg: '#3f3f46', // Cor de fundo das fontes (ícones de origem de upload)
                inactiveTabIcon: '#d4d4d8', // Cor dos ícones das abas inativas
              },
              fonts: {
                default: null,
                "'Poppins', sans-serif": {
                  url: 'https://fonts.googleapis.com/css?family=Poppins',
                  active: true,
                },
              },
            },
          },
          (error: unknown, result: any) => {
            if (!error && result && result.event === 'success') {
              onUploadSuccess(result.info)
            }
          }
        )
      }
    }

    loadCloudinaryWidget()
  }, [onUploadSuccess, signatureEndpoint, uploadPreset])

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()

    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  return (
    <Button
      id="cloudinary-upload-button"
      className="absolute -bottom-3 -right-1 bg-zinc-600 hover:bg-zinc-500 rounded-full h-10 w-10"
      onClick={handleClick}
    >
      <span className="text-zinc-400">📷</span>
    </Button>
  )
}
