const path = require("path");
const multer = require("multer");
const Orphan = require("../models/Orphan");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/orphan_images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const createOrphanProfile = async (req, res) => {
  const { name, age, gender, education_status, health_condition, orphanage_id } = req.body;
  const profile_image = req.file ? req.file.filename : null;

  if (!name || !age || !gender || !orphanage_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const { valid, message } = validateOrphanProfile(name, age, gender, education_status, health_condition);
  if (!valid) return res.status(400).json({ message });

  try {
    await Orphan.create({
      name,
      age,
      gender,
      education_status,
      health_condition,
      orphanage_id,
      profile_image,
    });
    res.status(201).json({ message: "Orphan profile created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrphansByOrphanage = async (req, res) => {
  const { orphanage_id } = req.params;
  try {
    const orphans = await Orphan.findAll({ where: { orphanage_id } });
    res.json({ orphans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orphans" });
  }
};

const getOrphanById = async (req, res) => {
  const { id } = req.params;
  try {
    const orphan = await Orphan.findByPk(id);
    if (!orphan) return res.status(404).json({ message: "Orphan not found" });
    res.json({ orphan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orphan" });
  }
};

const updateOrphan = async (req, res) => {
    const { id } = req.params;
    const { age, gender, education_status, health_condition, name } = req.body;
    const profile_image = req.file ? req.file.filename : null;
  
    if (name) {
      return res.status(400).json({ message: "You are not allowed to update the orphan's name." });
    }
  
    try {
      const orphan = await Orphan.findByPk(id);
      if (!orphan) return res.status(404).json({ message: "Orphan not found" });
  
      const updatedFields = {};
  
      if (age !== undefined) updatedFields.age = age;
      if (gender !== undefined) updatedFields.gender = gender;
      if (education_status !== undefined) updatedFields.education_status = education_status;
      if (health_condition !== undefined) updatedFields.health_condition = health_condition;
      if (profile_image !== null) updatedFields.profile_image = profile_image;
  
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
  
      await orphan.update(updatedFields);
      res.json({ message: "Orphan profile updated successfully", updatedFields });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating orphan" });
    }
  };
  

const deleteOrphan = async (req, res) => {
  const { id } = req.params;
  try {
    const orphan = await Orphan.findByPk(id);
    if (!orphan) return res.status(404).json({ message: "Orphan not found" });

    await orphan.destroy();
    res.json({ message: "Orphan profile deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting orphan" });
  }
};

function validateOrphanProfile(name, age, gender) {
  if (!name || age <= 0 || age > 150 || !gender) {
    return { valid: false, message: "Invalid orphan profile data" };
  }
  return { valid: true };
}

module.exports = {
  upload,
  createOrphanProfile,
  getOrphansByOrphanage,
  getOrphanById,
  updateOrphan,
  deleteOrphan,
};
