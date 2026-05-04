const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
  try {
    const db = getDB();
    const experiences = await db.collection('experiences')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperience = async (req, res) => {
  try {
    const db = getDB();
    const experience = await db.collection('experiences').findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    return res.json({ success: true, data: experience });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const db = getDB();
    const { title, company, location, type, startDate, endDate, current, description, technologies, order } = req.body;

    if (!title || !company || !startDate || !description) {
      return res.status(400).json({ success: false, message: 'Title, company, startDate, and description are required' });
    }

    const experience = {
      title,
      company,
      location: location || '',
      type: type || 'Full-time',
      startDate,
      endDate: current ? 'Present' : (endDate || ''),
      current: current || false,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('experiences').insertOne(experience);
    experience._id = result.insertedId;

    return res.status(201).json({ success: true, data: experience });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    const db = getDB();
    const { title, company, location, type, startDate, endDate, current, description, technologies, order } = req.body;

    const updateData = {
      title,
      company,
      location: location || '',
      type: type || 'Full-time',
      startDate,
      endDate: current ? 'Present' : (endDate || ''),
      current: current || false,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      order: order || 0,
      updatedAt: new Date(),
    };

    const result = await db.collection('experiences').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('experiences').deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    return res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExperiences, getExperience, createExperience, updateExperience, deleteExperience };
