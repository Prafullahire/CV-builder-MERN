const PDFDocument = require("pdfkit");
const CV = require("../models/CV");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const safeParse = (data) => {
  try {
    if (!data) return {};                           // empty
    if (typeof data === "object") return data;      // already parsed
    return JSON.parse(data);                        // parse JSON
  } catch (e) {
    return {};                                      // fallback
  }
};

exports.createCV = async (req, res) => {
  try {
    const basic = JSON.parse(req.body.basic || "{}");
    const education = JSON.parse(req.body.education || "[]");
    const experience = JSON.parse(req.body.experience || "[]");
    const projects = JSON.parse(req.body.projects || "[]");
    const skills = JSON.parse(req.body.skills || "[]");
    const social = JSON.parse(req.body.social || "[]");

    const newCV = new CV({
      user: req.user._id,
      // basic,
       basic: {
        ...basic,
        image: req.file ? `/uploads/${req.file.filename}` : "",
      },
      education,
      experience,
      projects,
      skills,
      social,
      // image: req.file ? req.file.filename : "",
      layout: safeParse(req.body.layout) || {},

    });

    const saved = await newCV.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({
      message: "CV Creation Failed",
      error: err.message,
    });
  }
};

exports.getCVs = async (req, res) => {
  try {
    const list = await CV.find({ user: req.user.id });
    res.json(list);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getCVById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid CV ID" });
  }

  const cv = await CV.findById(id);
  if (!cv) return res.status(404).json({ message: "CV not found" });
  res.json(cv);
};

exports.updateCV = async (req, res) => {
  try {
    console.log("RAW BODY:", req.body);

    const updatedData = {
      // basic: safeParse(req.body.basic),
       basic: {
        ...safeParse(req.body.basic),
        image: req.file ? `/uploads/${req.file.filename}` : safeParse(req.body.basic).image,
      },
      education: safeParse(req.body.education),
      experience: safeParse(req.body.experience),
      projects: safeParse(req.body.projects),
      skills: safeParse(req.body.skills),
      social: safeParse(req.body.social),
    };

    const cv = await CV.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: "Error updating CV", details: error.message });
  }
};


exports.deleteCV = async (req, res) => {
  try {
    const removed = await CV.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "CV not found" });

    res.json({ message: "CV deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};


exports.downloadCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const cv = await CV.findById(cvId);

    if (!cv) return res.status(404).json({ message: "CV not found" });

    // Set default layout if missing
    const layout = cv.layout || {
      font: "Arial",
      size: 14,
      color: "#000",
      bgColor: "#f8f9fa",
    };

    // Build HTML for PDF
   const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: ${layout.font || "Arial, sans-serif"};
          font-size: ${layout.size || 14}px;
          color: ${layout.color || "#000"};
          background-color: ${layout.bgColor || "#f8f9fa"};
          padding: 20px;
        }
        img { width: 100px; height: 100px; border-radius: 50%; }
        h2 { margin-bottom: 5px; }
        hr { margin: 15px 0; }
      </style>
    </head>
    <body>
      ${cv.basic?.image ? `<img src="http://localhost:5000${cv.basic.image}" />` : ""}
      <h2>${cv.basic?.name || ""}</h2>
      <p><strong>Email:</strong> ${cv.basic?.email || ""}</p>
      <p><strong>Phone:</strong> ${cv.basic?.phone || ""}</p>
      <p><strong>Intro:</strong> ${cv.basic?.intro || ""}</p>
       <p><strong>Introduction Paragraph:</strong> ${cv.basic?.introductionParagraph || ""}</p>
      <hr/>
      <h3>Education</h3>
      ${cv.education?.map(
        (edu) =>
          `<p>${edu.degree || ""} - ${edu.institution || ""} (${
            edu.percentage || ""
          }%)</p>`
      ).join("")}
      <hr/>
      <h3>Experience</h3>
      ${cv.experience?.map(
        (exp) =>
          `<p>${exp.position || ""} at ${exp.organization || ""} (${
            exp.joiningDate || ""
          } - ${exp.leavingDate || ""})</p>`
      ).join("")}
      <hr/>
      <h3>Projects</h3>
      ${cv.projects?.map(
        (proj) => `<p>${proj.title || ""} - ${proj.duration || ""}</p>`
      ).join("")}
      <hr/>
      <h3>Skills</h3>
      ${cv.skills?.map(
        (skill) => `<p>${skill.name || ""} (${skill.percentage || ""}%)</p>`
      ).join("")}
      <hr/>
      <h3>Social Profiles</h3>
      ${cv.social?.map(
        (s) => `<p>${s.platform || ""}: ${s.link || ""}</p>`
      ).join("")}
    </body>
  </html>
`;


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Send PDF to client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cv.basic?.name || "CV"}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download CV Error:", err);
    res.status(500).json({ message: "Failed to generate PDF", error: err.message });
  }
};


exports.shareCV = async (req, res) => {
  res.json({ link: "share-link-coming-soon" });
};
