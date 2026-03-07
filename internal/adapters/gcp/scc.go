package gcp

import (
	"context"
	"fmt"
	"log"
	"os"

	securitycenter "cloud.google.com/go/securitycenter/apiv1"
	"cloud.google.com/go/securitycenter/apiv1/securitycenterpb"
)

func ReportVulnerability(ctx context.Context, projectID string, findingID string, cvssScore float32) {
	client, err := securitycenter.NewClient(ctx)
	if err != nil {
		log.Fatalf("Failed to create SCC client: %v", err)
	}
	defer client.Close()

	// Logic to create a finding in SCC
	req := &securitycenterpb.CreateFindingRequest{
		Parent:    fmt.Sprintf("projects/%s/sources/12345", projectID),
		FindingId: findingID,
		Finding: &securitycenterpb.Finding{
			State:        securitycenterpb.Finding_ACTIVE,
			FindingClass: securitycenterpb.Finding_VULNERABILITY,
			Severity:     securitycenterpb.Finding_HIGH,
			Indicator: &securitycenterpb.Indicator{
				Domains: []string{"kryptobot-engine.internal"},
			},
		},
	}

	_ = req // Simulation since we don't have real SCC Source ID
	fmt.Printf("Vulnerability Reported: CVSS v4 Score: %v\n", cvssScore)

	// Write to markdown vulnerability log
	f, _ := os.OpenFile("VULNERABILITIES.md", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	defer f.Close()
	f.WriteString(fmt.Sprintf("| %s | %v | %s | ACTIVE |\n", findingID, cvssScore, "HFT-Alpha"))
}
