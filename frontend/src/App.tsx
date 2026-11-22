import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import ExpertiseSection from './components/Expertise'
import TechStack from './components/TechStack'
import TechMarquee from './components/TechMarquee'
import TimelineSection from './components/Timeline'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Spotlight from './components/Spotlight'
import Numbers from './components/Numbers'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio relative">
        <Spotlight />
        <Nav />
        <main>
          <Hero />
          <About />
          <Numbers />
          <ExpertiseSection />
          <TechMarquee />
          <TechStack />
          <TimelineSection />
          <Education />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
