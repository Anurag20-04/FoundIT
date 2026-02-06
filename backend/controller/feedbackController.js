const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    let { rating, message, page } = req.body;

    // Normalize message early
    message = typeof message === "string" ? message.trim() : null;

    // Normalize rating early
    if (rating !== undefined && rating !== null) {
      rating = Number(rating);
    }

    // HARD validation: at least one valid input
    const isMessageValid = message && message.length >= 3;
    const isRatingValid =
      typeof rating === "number" && !Number.isNaN(rating);

    if (!isMessageValid && !isRatingValid) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message or rating",
      });
    }

    // Rating range validation
    if (isRatingValid && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Extract IP safely (proxy + IPv6 safe)
    const rawIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    const ip = rawIp
      ? rawIp.split(",")[0].replace("::ffff:", "").trim()
      : null;

    const feedback = await Feedback.create({
      user: req.user?._id || null,
      message: isMessageValid ? message : null,
      rating: isRatingValid ? rating : null,
      page: page || null,
      userAgent: req.headers["user-agent"] || null,
      ip,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("❌ Feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error("❌ Fetch feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};
