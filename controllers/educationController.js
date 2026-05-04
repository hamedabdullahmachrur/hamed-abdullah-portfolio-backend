const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
const getEducations = async (req, res) => {
  try {
    const db = getDB();
    const educations = await db.collection('education')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return res.json({ success: true, count: educations.length, data: educations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single education entry
// @route   GET /api/education/:id
// @access  Public
const getEducation = async (req, res) => {
  try {
    const db = getDB();
    const education = await db.collection('education').findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    return res.json({ success: true, data: education });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create education entry
// @route   POST /api/education
// @access  Private
const createEducation = async (req, res) => {
  try {
    const db = getDB();
    const { degree, institution, location, fieldOfStudy, startDate, endDate, current, grade, description, order } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({ success: false, message: 'Degree, institution, and startDate are required' });
    }

    const education = {
      degree,
      institution,
      location: location || '',
      fieldOfStudy: fieldOfStudy || '',
      startDate,
      endDate: current ? 'Present' : (endDate || ''),
      current: current || false,
      grade: grade || '',
      description: description || '',
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('education').insertOne(education);
    education._id = result.insertedId;

    return res.status(201).json({ success: true, data: education });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = async (req, res) => {
  try {
    const db = getDB();
    const { degree, institution, location, fieldOfStudy, startDate, endDate, current, grade, description, order } = req.body;

    const updateData = {
      degree,
      institution,
      location: location || '',
      fieldOfStudy: fieldOfStudy || '',
      startDate,
      endDate: current ? 'Present' : (endDate || ''),
      current: current || false,
      grade: grade || '',
      description: description || '',
      order: order || 0,
      updatedAt: new Date(),
    };

    const result = await db.collection('education').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('education').deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    return res.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEducations, getEducation, createEducation, updateEducation, deleteEducation };
