import express, { type Request, type Response, type NextFunction } from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Bulb from "tplink-lightbulb";
import config from "./config.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const light = new Bulb(process.env.BULB_IP ?? config.bulb);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(join(__dirname, "dist")));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*scan for new bulbs*/
app.get("/api/light/scan", (_req: Request, res: Response) => {
  const scan = Bulb.scan().on("light", (l) => {
    l.power(false).then((status: unknown) => {
      scan.stop();
      res.status(200).send(status);
    });
  });
});

/*request & return current info*/
app.get("/api/light/info", (_req: Request, res: Response) => {
  light
    .info()
    .then((info) => {
      res.status(200).send(info);
    })
    .catch((e: unknown) => console.error(e));
});

/*turn power on/off*/
app.get("/api/light/power", (_req: Request, res: Response) => {
  light.info().then((info) => {
    const state = info.light_state.on_off === 1;
    light
      .power(!state)
      .then((status) => res.status(200).send(status))
      .catch((err: unknown) => {
        console.error(err);
        res.status(500).send("Oops, Something went wrong!");
      });
  });
});

/*set the light to the received mode*/
app.post("/api/light/mode", (req: Request, res: Response) => {
  const settings = req.body as Record<string, string>;
  const msg = {
    "smartlife.iot.smartbulb.lightingservice": {
      transition_light_state: {
        ignore_default: 1,
        on_off: 1,
        transition_period: 0,
        mode: settings.mode,
        hue: parseInt(settings.hue, 10),
        saturation: parseInt(settings.saturation, 10),
        color_temp: parseInt(settings.color_temp, 10),
        brightness: parseInt(settings.brightness, 10),
      },
    },
  };
  light
    .send(msg)
    .then((s) => {
      res.status(200).send(s);
    })
    .catch((err: unknown) => {
      console.error(err);
      res.status(500).send("Oops, Something went wrong!");
    });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).sendFile(join(__dirname, "dist", "index.html"));
});

// Express route for any other unrecognised incoming requests
app.get("/api/*path", (_req: Request, res: Response) => {
  res.status(404).send("Unrecognised API call");
});
app.get("*path", (_req: Request, res: Response) => {
  res.status(404).send("Unrecognised path");
});

// Express route to handle errors
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send("Oops, Something went wrong!");
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
