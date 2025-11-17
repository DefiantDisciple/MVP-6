"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/ui/status-pill"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Countdown } from "@/components/ui/countdown"
import Link from "next/link"
import { ArrowLeft, FileText, Users, MessageSquare } from "lucide-react"

export default function TenderDetailPage() {
  const params = useParams()
  const [tender, setTender] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [clarifications, setClarifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTenderDetails()
  }, [params.id])

  const fetchTenderDetails = async () => {
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

      // Fetch clarifications
      const clarRes = await fetch(`/api/clarifications?tenderId=${params.id}`)
      if (clarRes.ok) {
        const clarData = await clarRes.json()
        setClarifications(clarData.clarifications || [])
      }
    } catch (error) {
      console.error('Error fetching tender details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Entity Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading tender details...</div>
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
          <Link href="/entity/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Tender Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tender.title}</h1>
              <p className="text-muted-foreground">{tender.description}</p>
            </div>
            <StatusPill status={tender.stage} />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(tender.budget)}</div>
                <p className="text-xs text-muted-foreground">Budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{bids.length}</div>
                <p className="text-xs text-muted-foreground">Submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{clarifications.length}</div>
                <p className="text-xs text-muted-foreground">Clarifications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Countdown deadline={new Date(tender.submissionDeadline)} showIcon={false} />
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tender Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({bids.length})</TabsTrigger>
            <TabsTrigger value="clarifications">Clarifications ({clarifications.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p>{tender.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Currency</h4>
                    <p>{tender.currency}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Published Date</h4>
                    <p>{formatDate(tender.publishedAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Submission Deadline</h4>
                    <p>{formatDate(tender.submissionDeadline)}</p>
                  </div>
                </div>
                
                {tender.requirements && tender.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {tender.requirements.map((req: string, index: number) => (
                        <li key={index} className="text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            {bids.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
                  <p className="text-muted-foreground">Submissions will appear here once providers submit their bids</p>
                </CardContent>
              </Card>
            ) : (
              bids.map((bid) => (
                <Card key={bid.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{bid.providerName}</CardTitle>
                        <CardDescription>Submitted {formatDate(bid.submittedAt)}</CardDescription>
                      </div>
                      <Badge variant="secondary">Version {bid.version}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Technical Proposal
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Financial Proposal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="clarifications" className="space-y-4">
            {clarifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Clarifications</h3>
                  <p className="text-muted-foreground">Clarification requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              clarifications.map((clarification) => (
                <Card key={clarification.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{clarification.providerName}</CardTitle>
                        <CardDescription>Asked {formatDate(clarification.askedAt)}</CardDescription>
                      </div>
                      <Badge variant={clarification.isPublic ? "default" : "secondary"}>
                        {clarification.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{clarification.question}</p>
                    {clarification.answer && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold mb-2">Response:</p>
                        <p>{clarification.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tender Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {tender.documentUrls && tender.documentUrls.length > 0 ? (
                  <div className="space-y-2">
                    {tender.documentUrls.map((url: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{url.split('/').pop()}</span>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
