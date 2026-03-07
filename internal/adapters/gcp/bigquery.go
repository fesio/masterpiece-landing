package gcp

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/bigquery"
)

func StoreMarketData(ctx context.Context, projectID string, datasetID string, tableID string, data interface{}) {
	client, err := bigquery.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create BigQuery client: %v", err)
	}
	defer client.Close()

	inserter := client.Dataset(datasetID).Table(tableID).Inserter()
	if err := inserter.Put(ctx, data); err != nil {
		fmt.Printf("Error inserting into BigQuery: %v\n", err)
	}
}
