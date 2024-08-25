import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LandingPage from '@/components/LandingPage'

export default function Home() {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <LandingPage />
        </main>
        <Footer />
      </div>
    </Providers>
  )
}