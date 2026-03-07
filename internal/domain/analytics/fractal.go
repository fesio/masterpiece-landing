package analytics

import (
	"context"
	"fmt"
	"time"
)

func StartOnChainFractal(ctx context.Context, poolSize int) {
	jobs := make(chan float64, poolSize)
	for i := 0; i < poolSize; i++ {
		go worker(ctx, jobs)
	}

	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			jobs <- 0.32 // Fractal H value
		}
	}
}

func worker(ctx context.Context, jobs <-chan float64) {
	for {
		select {
		case <-ctx.Done():
			return
		case hValue := <-jobs:
			_ = fmt.Sprintf("Analyzing On-chain fractal with H=%v", hValue)
		}
	}
}
