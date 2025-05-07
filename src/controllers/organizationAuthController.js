const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

exports.loginOrganization = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const organization = await Organization.findOne({ where: { contact_email: email } });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const token = jwt.sign(
      {
        id: organization.id,
        role: "organization",
        email: organization.contact_email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, organization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};
