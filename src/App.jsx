import React, { Suspense } from 'react'
import { Switch, Route } from 'wouter'
import { ScreenLoader } from './components/Loader'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy Load Route Components for better chunking
const Hub = React.lazy(() => import('./components/Hub').then(module => ({ default: module.Hub })))
const GlobeModule = React.lazy(() => import('./components/GlobeModule').then(module => ({ default: module.GlobeModule })))
const ParchmentModule = React.lazy(() => import('./components/ParchmentModule').then(module => ({ default: module.ParchmentModule })))
const StarFieldModule = React.lazy(() => import('./components/StarFieldModule').then(module => ({ default: module.StarFieldModule })))
const HelixGalleryModule = React.lazy(() => import('./components/HelixGalleryModule').then(module => ({ default: module.HelixGalleryModule })))
const GiftModule = React.lazy(() => import('./components/GiftModule').then(module => ({ default: module.GiftModule })))

import { AudioManager } from './components/AudioManager'
import { BootSequence } from './components/BootSequence'
import { StarDustCursor } from './components/StarDustCursor'
import { BIRTH_DATE, COMPLIMENTS } from './utils/constants'

export function App() {
  const [booted, setBooted] = React.useState(false)

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />
  }

  // Dynamic Title Effect
  React.useEffect(() => {
    const originalTitle = document.title
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "✨ The stars are waiting..."
      } else {
        document.title = "Happy Birthday Nandini! 🎂"
        setTimeout(() => {
          document.title = originalTitle
        }, 2000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <div className="w-full h-full relative font-sans">
      <StarDustCursor />
      <ErrorBoundary>
        <Suspense fallback={<ScreenLoader />}>
          <Switch>
            <Route path="/" component={Hub} />
            <Route path="/globe" component={GlobeModule} />
            <Route path="/parchment" component={ParchmentModule} />
            <Route path="/stars" component={StarFieldModule} />
            <Route path="/gallery" component={HelixGalleryModule} />
            <Route path="/gift" component={GiftModule} />
            <Route>
              {/* Default to Hub or 404 */}
              <Hub />
            </Route>
          </Switch>
        </Suspense>
      </ErrorBoundary>

      <AudioManager />

      <div className="absolute bottom-4 left-4 pointer-events-none z-50">
        <Greeting />
      </div>
    </div>
  )
}

function Greeting() {
  const [text, setText] = React.useState("")

  React.useEffect(() => {
    const today = new Date()
    // Months are 0-indexed in JS, so we compare month+1 to our 1-indexed constant
    const isBirthday = (today.getMonth() + 1 === BIRTH_DATE.month) &&
      (today.getDate() === BIRTH_DATE.day)

    if (isBirthday) {
      setText("Happy Birthday Nandini!")
    } else {
      // Pick a random compliment based on the day of the year (pseudo-random but stable for the day)
      // or just truly random on every load? Let's go with truly random for variety on refresh.
      const randomIndex = Math.floor(Math.random() * COMPLIMENTS.length)
      setText(COMPLIMENTS[randomIndex])
    }
  }, [])

  if (!text) return null

  return (
    <h1 className="text-xl font-bold text-white tracking-widest uppercase opacity-70 animate-pulse">
      {text}
    </h1>
  )
}
