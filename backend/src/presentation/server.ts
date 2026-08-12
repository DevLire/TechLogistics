import { createServer, Server as HttpServer } from 'node:http';
import express, { Router } from 'express';
import cors from 'cors';
import { RealtimeServer } from '../infrastructure/realtime/core/realtime.server';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  private readonly httpServer: HttpServer;
  private app = express();
  private readonly realtimeServer: RealtimeServer;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.httpServer = createServer(this.app);
    this.realtimeServer = new RealtimeServer(this.httpServer);
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //* Middlewares

    const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? '')
      .split(',')
      .map((origin) => origin.trim());
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          return callback(new Error('No permitido por políticas de CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    // parse application/json
    this.app.use(express.json());
    // parse application/x-www-form-urlencoded
    this.app.use(express.urlencoded({ extended: true }));

    //* Routes
    this.app.use(this.routes);

    this.realtimeServer.initialize();

    this.httpServer.listen(this.port, '0.0.0.0', () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
