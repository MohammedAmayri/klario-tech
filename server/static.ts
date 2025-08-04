import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // Docker production: working dir is /app, files are at /app/dist/public
  // Local production: working dir is /project/dist, files are at /project/dist/public
  const clientPath = process.env.DOCKER_CONTAINER === "true"
    ? path.resolve("/app/dist/public")     // Docker: absolute path
    : path.resolve(process.cwd(), "public"); // Local: relative to current dir (/project/dist)
  
  if (!fs.existsSync(clientPath)) {
    throw new Error(
      `Could not find the build directory: ${clientPath}, make sure to build the client first`
    );
  }

  app.use(express.static(clientPath));
  
  // Serve index.html for all non-API routes (SPA fallback)
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
      return next();
    }
    
    const indexPath = path.join(clientPath, "index.html");
    res.sendFile(indexPath);
  });
}