package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/DawidFesio/Github/internal/domain/analytics"
	"github.com/DawidFesio/Github/internal/domain/security"
	"github.com/DawidFesio/Github/internal/domain/trading"
)

const (
	WorkerPoolSize = 10
	ProjectID      = "kryptobot-454807"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	var wg sync.WaitGroup

	// Stream A: Real-time Market Data (HFT Alpha)
	wg.Add(1)
	go func() {
		defer wg.Done()
		trading.StartHFTStream(ctx, WorkerPoolSize)
	}()

	// Stream B: On-chain Fractal Analysis (H≈0.32)
	wg.Add(1)
	go func() {
		defer wg.Done()
		analytics.StartOnChainFractal(ctx, WorkerPoolSize)
	}()

	// Stream C: Automated Security Log Auditing (Caido/Burp)
	wg.Add(1)
	go func() {
		defer wg.Done()
		security.StartLogAudit(ctx, WorkerPoolSize)
	}()

	fmt.Println("Multi-Domain Engine initialized. Status: Synchronized.")
	<-ctx.Done()
	fmt.Println("Shutting down engine...")
	wg.Wait()
}
