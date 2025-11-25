import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Trophy, Upload, FileText, Search, Handshake, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">VerDEX Systems</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="text-gray-700 border-gray-300">
              Sign in with II
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center py-20">
        {/* Network Wireframe Pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Network nodes */}
            <circle cx="100" cy="100" r="2" fill="currentColor" className="text-blue-400"/>
            <circle cx="300" cy="150" r="2" fill="currentColor" className="text-blue-400"/>
            <circle cx="500" cy="80" r="2" fill="currentColor" className="text-blue-400"/>
            <circle cx="700" cy="200" r="2" fill="currentColor" className="text-blue-400"/>
            <circle cx="900" cy="120" r="2" fill="currentColor" className="text-blue-400"/>
            <circle cx="1100" cy="180" r="2" fill="currentColor" className="text-blue-400"/>
            
            <circle cx="150" cy="300" r="2" fill="currentColor" className="text-blue-300"/>
            <circle cx="350" cy="350" r="2" fill="currentColor" className="text-blue-300"/>
            <circle cx="550" cy="280" r="2" fill="currentColor" className="text-blue-300"/>
            <circle cx="750" cy="400" r="2" fill="currentColor" className="text-blue-300"/>
            <circle cx="950" cy="320" r="2" fill="currentColor" className="text-blue-300"/>
            
            {/* Connection lines */}
            <line x1="100" y1="100" x2="300" y2="150" stroke="currentColor" strokeWidth="1" className="text-blue-400/40"/>
            <line x1="300" y1="150" x2="500" y2="80" stroke="currentColor" strokeWidth="1" className="text-blue-400/40"/>
            <line x1="500" y1="80" x2="700" y2="200" stroke="currentColor" strokeWidth="1" className="text-blue-400/40"/>
            <line x1="700" y1="200" x2="900" y2="120" stroke="currentColor" strokeWidth="1" className="text-blue-400/40"/>
            <line x1="900" y1="120" x2="1100" y2="180" stroke="currentColor" strokeWidth="1" className="text-blue-400/40"/>
            
            <line x1="150" y1="300" x2="350" y2="350" stroke="currentColor" strokeWidth="1" className="text-blue-300/40"/>
            <line x1="350" y1="350" x2="550" y2="280" stroke="currentColor" strokeWidth="1" className="text-blue-300/40"/>
            <line x1="550" y1="280" x2="750" y2="400" stroke="currentColor" strokeWidth="1" className="text-blue-300/40"/>
            <line x1="750" y1="400" x2="950" y2="320" stroke="currentColor" strokeWidth="1" className="text-blue-300/40"/>
            
            {/* Cross connections */}
            <line x1="100" y1="100" x2="150" y2="300" stroke="currentColor" strokeWidth="1" className="text-blue-400/30"/>
            <line x1="300" y1="150" x2="350" y2="350" stroke="currentColor" strokeWidth="1" className="text-blue-400/30"/>
            <line x1="500" y1="80" x2="550" y2="280" stroke="currentColor" strokeWidth="1" className="text-blue-400/30"/>
            <line x1="700" y1="200" x2="750" y2="400" stroke="currentColor" strokeWidth="1" className="text-blue-400/30"/>
            <line x1="900" y1="120" x2="950" y2="320" stroke="currentColor" strokeWidth="1" className="text-blue-400/30"/>
          </svg>
        </div>
        
        <div className="text-center relative z-10">
          <h1 className="text-6xl font-bold text-white mb-8">
            Procurement Made Simple
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/admin/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg min-w-[200px]">
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/entity/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg min-w-[200px]">
                Entity Dashboard
              </Button>
            </Link>
            <Link href="/provider/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg min-w-[200px]">
                Service Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {/* Card 1: Open Tenders */}
            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">1,200+</div>
                <div className="text-gray-600 font-medium">Open Tenders</div>
              </CardContent>
            </Card>

            {/* Card 2: Closing Soon */}
            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">85</div>
                <div className="text-gray-600 font-medium mb-2">Closing Soon</div>
                <div className="text-sm text-gray-500">05 SEP 2024 - 12 SEP 2024</div>
              </CardContent>
            </Card>

            {/* Card 3: Awarded Tenders */}
            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">5,500+</div>
                <div className="text-gray-600 font-medium mb-2">Awarded Tenders</div>
                <div className="text-lg font-semibold text-gray-800">P15.2 Billion</div>
              </CardContent>
            </Card>
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
