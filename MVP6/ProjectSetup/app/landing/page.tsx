"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Trophy, Upload, FileText, Search, Handshake, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isHovering, setIsHovering] = React.useState(false)

  const valuePropositions = [
    {
      icon: <CheckCircle className="h-6 w-6 text-white mt-1" />,
      title: "End-to-End Tender Control",
      description: "Create, publish, evaluate, and award tenders in one controlled workflow — reducing coordination overhead and process delays.",
      gradient: "bg-gradient-to-br from-blue-600 to-blue-800"
    },
    {
      icon: <FileText className="h-6 w-6 text-white mt-1" />,
      title: "Fair & Defensible Evaluation",
      description: "Structured evaluations reduce rework, disputes, and costly post-award challenges.",
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-800"
    },
    {
      icon: <Clock className="h-6 w-6 text-white mt-1" />,
      title: "Contract Execution Tracking",
      description: "Early visibility into milestone delays helps prevent cost overruns and uncontrolled variations.",
      gradient: "bg-gradient-to-br from-amber-600 to-amber-800"
    },
    {
      icon: <Search className="h-6 w-6 text-white mt-1" />,
      title: "Audit-Ready Records",
      description: "Clear records reduce audit time, compliance costs, and management overhead.",
      gradient: "bg-gradient-to-br from-purple-600 to-purple-800"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % valuePropositions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + valuePropositions.length) % valuePropositions.length)
  }

  // Auto-advance carousel every 5 seconds (pauses on hover)
  React.useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide, isHovering])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">VerDEX Systems</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="text-gray-700 border-gray-300">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center py-20">
        {/* Network Wireframe Pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Network nodes */}
            <circle cx="100" cy="100" r="2" fill="currentColor" className="text-blue-400" />
            <circle cx="300" cy="150" r="2" fill="currentColor" className="text-blue-400" />
            <circle cx="500" cy="80" r="2" fill="currentColor" className="text-blue-400" />
            <circle cx="700" cy="200" r="2" fill="currentColor" className="text-blue-400" />
            <circle cx="900" cy="120" r="2" fill="currentColor" className="text-blue-400" />
            <circle cx="1100" cy="180" r="2" fill="currentColor" className="text-blue-400" />

            <circle cx="150" cy="300" r="2" fill="currentColor" className="text-blue-300" />
            <circle cx="350" cy="350" r="2" fill="currentColor" className="text-blue-300" />
            <circle cx="550" cy="280" r="2" fill="currentColor" className="text-blue-300" />
            <circle cx="750" cy="400" r="2" fill="currentColor" className="text-blue-300" />
            <circle cx="950" cy="320" r="2" fill="currentColor" className="text-blue-300" />

            {/* Connection lines */}
            <line x1="100" y1="100" x2="300" y2="150" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />
            <line x1="300" y1="150" x2="500" y2="80" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />
            <line x1="500" y1="80" x2="700" y2="200" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />
            <line x1="700" y1="200" x2="900" y2="120" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />
            <line x1="900" y1="120" x2="1100" y2="180" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />

            <line x1="150" y1="300" x2="350" y2="350" stroke="currentColor" strokeWidth="1" className="text-blue-300/40" />
            <line x1="350" y1="350" x2="550" y2="280" stroke="currentColor" strokeWidth="1" className="text-blue-300/40" />
            <line x1="550" y1="280" x2="750" y2="400" stroke="currentColor" strokeWidth="1" className="text-blue-300/40" />
            <line x1="750" y1="400" x2="950" y2="320" stroke="currentColor" strokeWidth="1" className="text-blue-300/40" />

            {/* Cross connections */}
            <line x1="100" y1="100" x2="150" y2="300" stroke="currentColor" strokeWidth="1" className="text-blue-400/30" />
            <line x1="300" y1="150" x2="350" y2="350" stroke="currentColor" strokeWidth="1" className="text-blue-400/30" />
            <line x1="500" y1="80" x2="550" y2="280" stroke="currentColor" strokeWidth="1" className="text-blue-400/30" />
            <line x1="700" y1="200" x2="750" y2="400" stroke="currentColor" strokeWidth="1" className="text-blue-400/30" />
            <line x1="900" y1="120" x2="950" y2="320" stroke="currentColor" strokeWidth="1" className="text-blue-400/30" />
          </svg>
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-6xl font-bold text-white mb-4">
            Procurement Made Simple
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transparent, efficient, and secure procurement platform.
          </p>
          <div className="flex justify-center items-center">
            <Link href="/login?tab=demo">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg min-w-[240px]">
                View Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Invite-only access • Contact your administrator to get started
          </p>
        </div>
      </section>

      {/* Value Propositions Carousel Section */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {valuePropositions.map((prop, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className={`p-8 border-0 shadow-2xl ${prop.gradient}`}>
                      <CardContent className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {prop.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-3">{prop.title}</h3>
                            <p className="text-white/90 text-lg leading-relaxed">
                              {prop.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all ${isHovering ? 'opacity-100' : 'opacity-0'
                }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all ${isHovering ? 'opacity-100' : 'opacity-0'
                }`}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {valuePropositions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'w-10 bg-blue-600 shadow-lg'
                    : 'w-3 bg-gray-400 hover:bg-gray-500'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it Works</h2>

          <div className="flex items-center justify-between">
            {/* Step 1: Publish */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Publish</h3>
              <p className="text-gray-600">Agencies post tender notices</p>
            </div>

            {/* Arrow 1 */}
            <div className="flex justify-center px-4">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>

            {/* Step 2: Bid */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bid</h3>
              <p className="text-gray-600">Suppliers submit proposals</p>
            </div>

            {/* Arrow 2 */}
            <div className="flex justify-center px-4">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>

            {/* Step 3: Evaluate */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Evaluate</h3>
              <p className="text-gray-600">Committees review bids</p>
            </div>

            {/* Arrow 3 */}
            <div className="flex justify-center px-4">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>

            {/* Step 4: Award */}
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Award</h3>
              <p className="text-gray-600">Contracts are finalized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="text-center">
          <p className="text-gray-400">
            © 2024 VerDEX Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
