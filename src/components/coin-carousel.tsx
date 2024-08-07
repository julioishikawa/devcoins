import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export async function CoinCarousel() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full lg:w-[1000px]"
    >
      <CarouselContent>
        {Array.from({ length: 9 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
          >
            <div className="p-2 border-none">
              <Card className="border-none bg-zinc-800">
                <CardContent className="flex aspect-square items-center justify-center p-6 bg-zinc-800 rounded">
                  <span className="text-3xl font-semibold text-white">
                    {index + 1}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-zinc-800 border-none" />
      <CarouselNext className="bg-zinc-800 border-none" />
    </Carousel>
  )
}
