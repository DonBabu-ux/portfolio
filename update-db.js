const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const newDesc = "This project serves as a premium showcase of advanced visual identities, user interface mockup ecosystems, and high-fidelity vector illustrations. Every project featured was meticulously crafted using Adobe Photoshop, Illustrator, and Figma to bridge the gap between abstract branding concepts and tangible digital experiences.";
    await Project.findOneAndUpdate(
      { slug: 'graphics-portfolio' }, 
      { $set: { longDescription: newDesc } }
    );
    console.log('✅ Done updating DB with final description');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
update();
