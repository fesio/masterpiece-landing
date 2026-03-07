package trading

import (
	"context"
	"fmt"
	"time"
)

func StartHFTStream(ctx context.Context, poolSize int) {
	jobs := make(chan struct{}, poolSize)
	for i := 0; i < poolSize; i++ {
		go worker(ctx, jobs)
	}

	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			jobs <- struct{}{}
		}
	}
}

func worker(ctx context.Context, jobs <-chan struct{}) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-jobs:
			// Simulating HFT Alpha execution
			_ = fmt.Sprint("Processing HFT Market Data...")
		}
	}
}
