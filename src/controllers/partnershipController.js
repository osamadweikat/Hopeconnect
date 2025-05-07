const Partnership = require('../models/Organization');
const {
  sendPartnershipSubmissionConfirmation,
  sendPartnershipStatusUpdate,
  sendPartnershipInfoUpdate
} = require('../utils/emailService');

exports.addPartnership = async (req, res) => {
  try {
    const {
      organization_name,
      contact_person,
      contact_email,
      phone_number,
      website,
      description
    } = req.body;

    if (!organization_name || !contact_email) {
      return res.status(400).json({ message: 'Organization name and email are required' });
    }

    const newPartnership = await Partnership.create({
      organization_name,
      contact_person,
      contact_email,
      phone_number,
      website,
      description,
      status: 'pending'
    });

    await sendPartnershipSubmissionConfirmation(contact_email, organization_name);

    res.status(201).json({
      message: 'Partnership request submitted',
      partnership: newPartnership
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding partnership' });
  }
};


exports.getAllPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.findAll();
    res.json({ partnerships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching partnerships' });
  }
};

exports.getPendingPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.findAll({ where: { status: 'pending' } });
    res.json({ partnerships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching pending partnerships' });
  }
};

exports.updatePartnershipStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const partnership = await Partnership.findByPk(id);
      if (!partnership) return res.status(404).json({ message: 'Partnership not found' });
  
      partnership.status = status;
      await partnership.save();
  
      const adminEmail = req.user?.email || 'admin@hopeconnect.org';
      await sendPartnershipStatusUpdate(
        partnership.contact_email,
        partnership.organization_name,
        status,
        adminEmail
      );
  
      res.json({ message: 'Partnership status updated and email sent', partnership });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while updating status' });
    }
  };
  

exports.updatePartnershipInfo = async (req, res) => {
  const { id } = req.params;
  const {
    contact_person,
    contact_email,
    phone_number,
    website,
    description
  } = req.body;

  try {
    const partnership = await Partnership.findByPk(id);
    if (!partnership) return res.status(404).json({ message: 'Partnership not found' });

    if (contact_person !== undefined) partnership.contact_person = contact_person;
    if (contact_email !== undefined) partnership.contact_email = contact_email;
    if (phone_number !== undefined) partnership.phone_number = phone_number;
    if (website !== undefined) partnership.website = website;
    if (description !== undefined) partnership.description = description;

    await partnership.save();

    await sendPartnershipInfoUpdate(partnership.contact_email, partnership.organization_name);

    res.json({ message: 'Partnership info updated and email sent', partnership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating info' });
  }
};
