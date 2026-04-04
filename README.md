# LB130 Web Interface

A web interface for controlling the [TP-Link LB130](http://www.tp-link.com/us/products/details/cat-5609_LB130.html) smart bulb.

## Requirements

- Node.js 24+

## Setup

```sh
npm install
```

Set the bulb's IP or hostname in `config.json`:

```json
{
  "bulb": "192.168.1.x"
}
```

## Development

Start the mock bulb server (simulates a real LB130 over UDP):

```sh
npm run mock
```

Start the Vite dev server (proxies `/api` to the Express server):

```sh
npm run dev
```

Start the Express API server:

```sh
npm start
```

## Production

Build the frontend:

```sh
npm run build
```

Start the server:

```sh
npm start
```

The app is then available at `http://localhost:3000`.

## Docker

```sh
docker compose up
```

By default, `BULB_IP` is set to `host.docker.internal` (the host machine — useful when running the mock locally). Override it for a real bulb:

```sh
BULB_IP=192.168.1.x docker compose up
```

> **Linux:** Docker Desktop's `host.docker.internal` requires adding `extra_hosts: ["host.docker.internal:host-gateway"]` to the compose service, or uncommenting `network_mode: host`.

## Credits

- [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb) by konsumer
- [lightbulb.svg](https://www.codeseek.co/alexzaworski/animated-svg-lightbulb-XJgmYv) by Alex Zaworski
