"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, FileText, Award, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TenderEvaluationPage() {
  const params = useParams()
  const { toast } = useToast()
  const [tender, setTender] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvaluationData()
  }, [params.id])

  const fetchEvaluationData = async () => {
    try {
      setLoading(true)
      
      // Fetch tender details
      const tenderRes = await fetch(`/api/tenders/${params.id}`)
      if (tenderRes.ok) {
        const tenderData = await tenderRes.json()
        setTender(tenderData.tender)
      }

      // Fetch bids for this tender
      const bidsRes = await fetch(`/api/submissions?tenderId=${params.id}`)
      if (bidsRes.ok) {
        const bidsData = await bidsRes.json()
        setBids(bidsData.bids || [])
      }
    } catch (error) {
      console.error('Error fetching evaluation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAwardTender = async (bidId: string) => {
    try {
      const response = await fetch(`/api/tenders/${params.id}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidId }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tender awarded successfully",
        })
        fetchEvaluationData()
      } else {
        throw new Error('Failed to award tender')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to award tender",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Entity Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading evaluation data...</div>
        </main>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Entity Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Tender not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Entity Portal" />

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/entity/tenders/${params.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tender Details
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bid Evaluation</h1>
          <p className="text-muted-foreground">{tender.title}</p>
        </div>

        {/* Evaluation Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{bids.length}</div>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatCurrency(tender.budget)}</div>
              <p className="text-xs text-muted-foreground">Budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {bids.length > 0 ? formatCurrency(Math.min(...bids.map(b => b.financialScore * 1000))) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Lowest Bid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {bids.length > 0 ? Math.max(...bids.map(b => b.technicalScore + b.financialScore)).toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Highest Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Bid Evaluation Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Bid Evaluations</h2>
          
          {bids.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Submissions</h3>
                <p className="text-muted-foreground">No bids have been submitted for evaluation</p>
              </CardContent>
            </Card>
          ) : (
            bids
              .sort((a, b) => (b.technicalScore + b.financialScore) - (a.technicalScore + a.financialScore))
              .map((bid, index) => (
                <Card key={bid.id} className={`${index === 0 ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {bid.providerName}
                          {index === 0 && <Badge className="bg-green-500">Recommended</Badge>}
                        </CardTitle>
                        <CardDescription>Submitted {formatDate(bid.submittedAt)}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {(bid.technicalScore + bid.financialScore).toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">Technical Score</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">{bid.technicalScore}/100</div>
                        <p className="text-xs text-muted-foreground">Technical evaluation</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">Financial Score</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">{bid.financialScore}/100</div>
                        <p className="text-xs text-muted-foreground">Price competitiveness</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold">Bid Amount</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {formatCurrency(bid.financialScore * 1000)}
                        </div>
                        <p className="text-xs text-muted-foreground">Proposed amount</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Technical Proposal
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Financial Proposal
                      </Button>
                      {tender.stage === 'evaluation' && (
                        <Button 
                          onClick={() => handleAwardTender(bid.id)}
                          className="ml-auto"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Award Contract
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </main>
    </div>
  )
}
