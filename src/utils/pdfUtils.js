const PDFDocument = require("pdfkit");

exports.generateCVPDF = async (cv) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const {
        basic = {},
        education = [],
        experience = [],
        projects = [],
        skills = [],
        social = [],
      } = cv;

      // ---------- HEADER ----------
      doc.fontSize(22).text(basic.name || "No Name", { underline: true });
      doc.moveDown();

      doc.fontSize(14).text(`Email: ${basic.email || "N/A"}`);
      doc.text(`Phone: ${basic.phone || "N/A"}`);
      doc.text(`Intro: ${basic.intro || "N/A"}`);
      doc.moveDown();

      // ---------- EDUCATION ----------
      doc.fontSize(20).text("Education", { underline: true });
      doc.moveDown(0.5);

      education.forEach((ed) => {
        doc.fontSize(14).text(`${ed.degree} - ${ed.institution}`);
        doc.text(`${ed.startYear} - ${ed.endYear}`);
        doc.text(`${ed.percentage || ""}%`);
        doc.moveDown();
      });

      // ---------- EXPERIENCE ----------
      doc.addPage();
      doc.fontSize(20).text("Experience", { underline: true });
      doc.moveDown(0.5);

      experience.forEach((exp) => {
        doc.fontSize(14).text(`${exp.position} - ${exp.company}`);
        doc.text(`(${exp.startDate} - ${exp.endDate})`);
        doc.text(`Description: ${exp.description}`);
        doc.moveDown();
      });

      // ---------- PROJECTS ----------
      doc.addPage();
      doc.fontSize(20).text("Projects", { underline: true });
      doc.moveDown(0.5);

      projects.forEach((p) => {
        doc.fontSize(14).text(`${p.title} (${p.members} members)`);
        doc.text(`${p.description}`);
        doc.moveDown();
      });

      // ---------- SKILLS ----------
      doc.addPage();
      doc.fontSize(20).text("Skills", { underline: true });
      doc.moveDown(0.5);

      skills.forEach((s) => {
        doc.fontSize(14).text(`${s.name} - ${s.level}%`);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
