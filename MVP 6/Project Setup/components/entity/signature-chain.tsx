"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { CheckCircle, FileText, AwardIcon } from "lucide-react"
import type { Signature } from "@/lib/types"

interface SignatureChainProps {
  signatures: Signature[]
}

export function SignatureChain({ signatures }: SignatureChainProps) {
  const sortedSignatures = [...signatures].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "tender":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "bid":
        return <FileText className="h-5 w-5 text-green-600" />
      case "award":
        return <AwardIcon className="h-5 w-5 text-yellow-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Digital Signature Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSignatures.map((signature, index) => (
            <div key={signature.id} className="relative">
              {index < sortedSignatures.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
              )}

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getDocumentIcon(signature.documentType)}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{signature.signerName}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{signature.signerRole}</p>
                    </div>
                    <Badge variant="outline">{signature.documentType.toUpperCase()}</Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Signed on {formatDateTime(signature.timestamp)}</p>
                    <p className="text-xs font-mono text-muted-foreground break-all">Hash: {signature.signatureHash}</p>
                    <p className="text-xs text-muted-foreground">IP: {signature.ipAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortedSignatures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No signatures recorded yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
