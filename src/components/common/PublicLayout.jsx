import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout({ children }) {
  return (
    <div id="top">
      <Navbar />
      <main style={{ paddingTop: 24 }}>{children}</main>
      <Footer />
    </div>
  )
}
