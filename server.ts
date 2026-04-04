import express, { type Request, type Response, type NextFunction } from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Bulb from "tplink-lightbulb";
import config from "./config.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const light = new Bulb(process.env.BULB_IP ?? config.bulb);

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

/*request & return current info*/
app.get("/api/light/info", async (_req: Request, res: Response) => {
  try {
    const info = await light.info();
    res.status(200).send(info);
  } catch (e: unknown) {
    console.error(e);
    res.status(500).send("Oops, Something went wrong!");
  }
});

/*turn power on/off*/
app.get("/api/light/power", async (_req: Request, res: Response) => {
  try {
    const info = await light.info();
    const status = await light.power(info.light_state.on_off !== 1);
    res.status(200).send(status);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send("Oops, Something went wrong!");
  }
});

/*set the light to the received mode*/
app.post("/api/light/mode", async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const hue = parseInt(String(body.hue), 10);
  const saturation = parseInt(String(body.saturation), 10);
  const color_temp = parseInt(String(body.color_temp), 10);
  const brightness = parseInt(String(body.brightness), 10);

  if ([hue, saturation, color_temp, brightness].some(Number.isNaN)) {
    res
      .status(400)
      .send("Invalid body: hue, saturation, color_temp and brightness must be numbers");
    return;
  }

  const msg = {
    "smartlife.iot.smartbulb.lightingservice": {
      transition_light_state: {
        ignore_default: 1,
        on_off: 1,
        transition_period: 0,
        mode: String(body.mode ?? "normal"),
        hue,
        saturation,
        color_temp,
        brightness,
      },
    },
  };

  try {
    const s = await light.send(msg);
    res.status(200).send(s);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send("Oops, Something went wrong!");
  }
});

app.get("/api/*path", (_req: Request, res: Response) => {
  res.status(404).send("Unrecognised API call");
});
app.get("*path", (_req: Request, res: Response) => {
  res.status(404).send("Unrecognised path");
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send("Oops, Something went wrong!");
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
