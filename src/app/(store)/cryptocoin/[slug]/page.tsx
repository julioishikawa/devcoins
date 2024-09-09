import ClientCoinDetails from './client-coin-details'

export default function CoinDetailsPage({ params }: CoinsProps) {
  return (
    <>
      <ClientCoinDetails params={params} />
    </>
  )
}
