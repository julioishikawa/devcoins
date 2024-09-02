import { AdminPanel } from './data-table'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface User {
  id: string
  email: string
  username: string
  amount: number
}

export default function UsersTable() {
  return (
    <section>
      <main className="flex flex-col justify-between h-screen">
        <div className="h-screen">
          <Header />
          <AdminPanel />
        </div>

        <Footer />
      </main>
    </section>
  )
}
