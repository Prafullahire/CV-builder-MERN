// const mongoose = require("mongoose");

// const cvSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     basic: {
//       name: String,
//       email: String,
//       phone: String,
//       address: String,
//       city: String,
//       state: String,
//       pincode: String,
//       intro: String,
//       image: String,
//     },

//     education: [
//       {
//         degree: String,
//         institution: String,
//         percentage: String,
//         startDate: String,
//         endDate: String,
//       },
//     ],

//     experience: [
//       {
//         organization: String,   
//         position: String,
//         location: String,
//         ctc: String,
//         joiningDate: String,
//         leavingDate: String,
//         technologies: [String],
//       },
//     ],

//     projects: [
//       {
//         title: String,
//         teamSize: String,
//         duration: String,
//         technologies: [String],
//         description: String,
//       },
//     ],

//     skills: [
//       {
//         name: String,
//         percentage: String, // FIXED (was level:Number)
//       },
//     ],

//     social: [{ platform: String, link: String }],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CV", cvSchema);
const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    basic: { type: Object, default: {} },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    social: { type: Array, default: [] },

  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", cvSchema);
