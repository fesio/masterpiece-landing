package security

import (
	"context"
	"fmt"
	"time"
)

func StartLogAudit(ctx context.Context, poolSize int) {
	logs := make(chan string, poolSize)
	for i := 0; i < poolSize; i++ {
		go worker(ctx, logs)
	}

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			logs <- "Caido/Burp log entry"
		}
	}
}

func worker(ctx context.Context, logs <-chan string) {
	for {
		select {
		case <-ctx.Done():
			return
		case entry := <-logs:
			_ = fmt.Sprintf("Auditing Security Log: %s", entry)
		}
	}
}
