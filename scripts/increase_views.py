import requests
import random
import time
import argparse
import sys
import json
import os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# Busuanzi API endpoint
BUSUANZI_API = "https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
]

def simulate_visit(url):
    """
    Simulates a visit to the given URL to trigger Busuanzi counter.
    """
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Referer": url,
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive"
    }

    try:
        response = requests.get(BUSUANZI_API, headers=headers, timeout=10)
        return response.status_code == 200
    except Exception:
        return False

def process_url_batch(url, count, workers):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Processing {count} views for: {url} (Workers: {workers})", flush=True)

    success_count = 0
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(simulate_visit, url) for _ in range(count)]

        completed = 0
        for future in as_completed(futures):
            if future.result():
                success_count += 1
            completed += 1

            if completed % (50 if count < 1000 else 500) == 0 or completed == count:
                print(f"[{datetime.now().strftime('%H:%M:%S')}]   Progress: {completed}/{count} ({success_count} success)", flush=True)

    return success_count

def main():
    parser = argparse.ArgumentParser(description="Multi-threaded Busuanzi view simulator.")
    parser.add_argument("--url", help="Target URL (single mode)")
    parser.add_argument("--count", type=int, help="Number of views")
    parser.add_argument("--config", help="Path to JSON config file")
    parser.add_argument("--workers", type=int, default=50, help="Number of concurrent threads (default: 50)")

    args = parser.parse_args()

    tasks = []

    if args.config:
        if not os.path.exists(args.config):
            print(f"Error: Config file not found: {args.config}", flush=True)
            sys.exit(1)
        with open(args.config, 'r') as f:
            tasks = json.load(f)
    elif args.url and args.count:
        tasks = [{"url": args.url, "count": args.count}]
    else:
        print("Error: Provide either --url and --count, or --config.", flush=True)
        parser.print_help()
        sys.exit(1)

    total_requested = sum(t.get('count', 0) for t in tasks)
    start_time = time.time()

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting multi-threaded batch run...", flush=True)
    print(f"Total tasks: {len(tasks)} | Total views: {total_requested} | Max Workers: {args.workers}", flush=True)

    total_success = 0
    for task in tasks:
        url = task.get('url')
        count = task.get('count', 0)
        if not url or count <= 0:
            continue
        total_success += process_url_batch(url, count, args.workers)

    duration = time.time() - start_time
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Batch run finished in {duration:.2f} seconds.", flush=True)
    print(f"Total success: {total_success}/{total_requested}", flush=True)
    print(f"Average speed: {total_requested/duration:.2f} views/sec", flush=True)

if __name__ == "__main__":
    main()
