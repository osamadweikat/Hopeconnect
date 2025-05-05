const Logistics = require("../models/Logistics");

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { donation_id, status } = req.body;

    const [updated] = await Logistics.update(
      { status },
      { where: { donation_id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "No matching donation found" });
    }

    res.json({ message: "Delivery status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDeliveryStatus = async (req, res) => {
  try {
    const donation_id = req.params.id;

    const logistics = await Logistics.findAll({
      where: { donation_id }
    });

    res.json({ logistics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
