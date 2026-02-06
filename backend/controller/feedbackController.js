const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    const { rating, message, page } = req.body;

    if (
      (!message || message.trim().length < 3) &&
      (rating === undefined || rating === null)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message or a rating",
      });
    }

    let safeRating = null;
    if (rating !== undefined && rating !== null) {
      const parsed = Number(rating);
      if (parsed < 1 || parsed > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      safeRating = parsed;
    }

    const rawIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = rawIp?.split(",")[0]?.trim() || null;

    const feedback = await Feedback.create({
      user: req.user?._id || null,
      rating: safeRating,
      message: message?.trim() || null,
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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};
