"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/ui/status-pill"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, FileText, Award, Star, Download } from "lucide-react"

export default function BidDetailPage() {
  const params = useParams()
  const [bid, setBid] = useState<any>(null)
  const [tender, setTender] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBidDetails()
  }, [params.id])

  const fetchBidDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch bid details
      const bidRes = await fetch(`/api/submissions/${params.id}`)
      if (bidRes.ok) {
        const bidData = await bidRes.json()
        setBid(bidData.bid)
        
        // Fetch associated tender
        if (bidData.bid?.tenderId) {
          const tenderRes = await fetch(`/api/tenders/${bidData.bid.tenderId}`)
          if (tenderRes.ok) {
            const tenderData = await tenderRes.json()
            setTender(tenderData.tender)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching bid details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Provider Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading bid details...</div>
        </main>
      </div>
    )
  }

  if (!bid) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Provider Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Bid not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Provider Portal" />

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/provider/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Bid Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bid Details</h1>
              <p className="text-muted-foreground">{tender?.title || 'Loading tender...'}</p>
            </div>
            <Badge variant="secondary">Version {bid.version}</Badge>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatDate(bid.submittedAt)}</div>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold flex items-center gap-2">
                  {bid.technicalScore}/100
                  <Star className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">Technical Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold flex items-center gap-2">
                  {bid.financialScore}/100
                  <Star className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">Financial Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {(bid.technicalScore + bid.financialScore).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bid Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bid Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Current Status</p>
                <StatusPill status={tender?.stage || 'unknown'} />
              </div>
              {bid.isWithdrawn && (
                <Badge variant="destructive">Withdrawn</Badge>
              )}
              {tender?.awardedBidId === bid.id && (
                <Badge className="bg-green-500">
                  <Award className="h-4 w-4 mr-1" />
                  Awarded
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tender Information */}
        {tender && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tender Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Budget</h4>
                  <p>{formatCurrency(tender.budget)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <p>{tender.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Submission Deadline</h4>
                  <p>{formatDate(tender.submissionDeadline)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Deadline</h4>
                  <p>{formatDate(tender.evaluationDeadline)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submitted Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold">Technical Proposal</p>
                    <p className="text-sm text-muted-foreground">
                      Hash: {bid.technicalProposalHash?.substring(0, 16)}...
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold">Financial Proposal</p>
                    <p className="text-sm text-muted-foreground">
                      Hash: {bid.financialProposalHash?.substring(0, 16)}...
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Details */}
        {(bid.technicalScore > 0 || bid.financialScore > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Technical Evaluation</span>
                    <span className="text-2xl font-bold text-blue-600">{bid.technicalScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${bid.technicalScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Financial Evaluation</span>
                    <span className="text-2xl font-bold text-green-600">{bid.financialScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${bid.financialScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Overall Score</span>
                    <span className="text-3xl font-bold text-purple-600">
                      {(bid.technicalScore + bid.financialScore).toFixed(1)}/200
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
