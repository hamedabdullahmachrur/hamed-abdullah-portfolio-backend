const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const db = getDB();
    const { category, featured } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await db.collection('projects')
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const db = getDB();
    const { title, description, longDescription, image, techStack, liveUrl, githubUrl, category, featured, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const project = {
      title,
      description,
      longDescription: longDescription || '',
      image: image || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      category: category || 'Full Stack',
      featured: featured || false,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(project);
    project._id = result.insertedId;

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const db = getDB();
    const { title, description, longDescription, image, techStack, liveUrl, githubUrl, category, featured, order } = req.body;

    const updateData = {
      title,
      description,
      longDescription: longDescription || '',
      image: image || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      category: category || 'Full Stack',
      featured: featured || false,
      order: order || 0,
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
