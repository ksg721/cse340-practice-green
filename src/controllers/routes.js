import { Router } from "express";
import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";
import contactRoutes from "./forms/contact.js";
import registrationRoutes from './forms/registration.js';

// Create a new router instance
const router = Router();

// Load catalog styles for every catalog route
router.use("/catalog", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

// Load faculty styles for every faculty route
router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

// Load contact styles for every contact route
router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Home and basic pages
router.get("/", homePage);
router.get("/about", aboutPage);

// Course catalog routes
router.get("/catalog", catalogPage);
router.get("/catalog/:slugId", courseDetailPage);

// Faculty routes
router.get("/faculty", facultyListPage);
router.get("/faculty/:facultySlug", facultyDetailPage);

// Demo page with special middleware
router.get("/demo", addDemoHeaders, demoPage);

// Route to trigger a test error
router.get("/test-error", testErrorPage);

// Contact form routes
router.use("/contact", contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

export default router;
