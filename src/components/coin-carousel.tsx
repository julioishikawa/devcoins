import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export function CoinCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="max-w-md"
    >
      <CarouselContent>
        {Array.from({ length: 9 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
