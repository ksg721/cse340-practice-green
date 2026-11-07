import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createContactForm,
  getAllContactForms,
} from "../../models/forms/contact.js";

const router = Router();

/**
 * Display the contact form.
 */
const showContactForm = (req, res) => {
  res.render("forms/contact/form", {
    title: "Contact Us",
  });
};

/**
 * Handle a contact form submission.
 */
const handleContactSubmission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/contact");
  }

  const { subject, message } = req.body;

  try {
    await createContactForm(subject, message);

    req.flash("success", "Thank you for contacting us! We will respond soon.");

    res.redirect("/contact");
  } catch (error) {
    console.error("Error saving contact form:", error);
    req.flash(
      "error",
      "Unable to submit your message. Please try again later.",
    );
    res.redirect("/contact");
  }
};

/**
 * Display all contact form submissions.
 */
const showContactResponses = async (req, res) => {
  let contactForms = [];

  try {
    contactForms = await getAllContactForms();
  } catch (error) {
    console.error("Error retrieving contact forms:", error);
  }

  res.render("forms/contact/responses", {
    title: "Contact Form Submissions",
    contactForms,
  });
};

router.get("/", showContactForm);

router.post(
  "/",
  [
    body("subject")
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage("Subject must be between 2 and 255 characters")
      .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
      .withMessage(
        "Subject can only contain letters, numbers, spaces, and basic punctuation",
      ),

    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters")
      .custom((value) => {
        const words = value
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 0);

        const uniqueWords = new Set(words);
        const uniqueWordRatio = uniqueWords.size / words.length;

        if (words.length > 20 && uniqueWordRatio < 0.3) {
          throw new Error(
            "Message appears to be spam. Please provide a more detailed message",
          );
        }

        return true;
      }),
  ],
  handleContactSubmission,
);

router.get("/responses", showContactResponses);

export default router;
