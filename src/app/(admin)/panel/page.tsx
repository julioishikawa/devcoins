import { DataUsers } from './data-users'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default async function UsersTable() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <section className="h-screen">
      <main className="flex flex-col h-full justify-between">
        <div className="flex flex-col h-full">
          <Header />
          <DataUsers />
        </div>

        <Footer />
      </main>
    </section>
  )
}
